#!/usr/bin/env python3

import os
import fsspec
import xarray as xr
import geopandas
from time import perf_counter
from dask.distributed import Client


class catchtime:
    def __init__(self, msg):
        self.msg = msg + '...'
    def __enter__(self):
        print(self.msg, end='', flush=True)
        self.start = perf_counter()
        return self

    def __exit__(self, type, value, traceback):
        self.time = perf_counter() - self.start
        self.readout = f'{self.time:.3f} seconds'
        print(self.readout)

def collect_data():
    bucket_url = os.environ["BUCKET_URL"]
    key=os.environ["KEY"]
    secret=os.environ["SECRET"]
    shape_file=os.environ["SHAPE_FILE"]
    start_date=os.environ["START_DATE"]
    end_date=os.environ["END_DATE"]
    output_file=os.environ["OUTPUT_FILE"]
    
    with catchtime('loading zarr'):
        ds = xr.open_zarr(fsspec.get_mapper(bucket_url,
                              anon=False,
                              key=key,
                              secret=secret), consolidated=True)
    
    with catchtime('clipping zarr'):
        gdf = geopandas.read_file(shape_file)
        ds.rio.write_crs('EPSG:4326', inplace=True)
        ds = ds.rio.clip(gdf.geometry.values,
                          gdf.crs,
                          drop=True,
                          invert=False, from_disk=True)  
                  
    
    with catchtime('slicing zarr'):
        ds = ds.sel(time=slice(start_date, end_date)) 
    
    with catchtime('saving netcdf'):
        write_job = ds.to_netcdf(output_file,
                             mode='w',
                             format='NETCDF4',
                             compute=False)
        write_job.compute()


if __name__ == '__main__':
    n_workers = int(os.environ['N_WORKERS'])
    memory_limit = os.environ['MEMORY_LIMIT']
    client = Client(n_workers=n_workers, memory_limit=memory_limit)
    collect_data()