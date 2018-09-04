#!/usr/bin/env python3



import time
import numpy as np
import xarray as xr

def bbox_to_coords(lats, lons, bbox):
    """calculated lat, lon coordinates that fall within bounding box
    
    Args:
        lats: list of latitudes
        lons: list of longitudes
        bbox: bounding box coordinates (minX, minY, maxX, maxY)
    Returns:
        list of indices corresponding with lat, lon within bounding box
    """

    st = time.time()
    print('--> selecting lat,lon within bbox... ', end='', flush=True)

    minX, minY, maxX, maxY = bbox

    rlat, clat = np.where((lats >= minY) & (lats <= maxY))
    rlon, clon = np.where((lons >= minX) & (lons <= maxX))
    
    lat_coords = np.dstack((rlat, clat))
    lon_coords = np.dstack((rlon, clon))

    lat_rows, lat_cols = lat_coords[0].shape
    lon_rows, lon_cols = lon_coords[0].shape

    lat_dtype = {'names':['f{}'.format(i) for i in range(lat_cols)],'formats':lat_cols * [lat_coords.dtype]}
    lon_dtype = {'names':['f{}'.format(i) for i in range(lon_cols)],'formats':lon_cols * [lon_coords.dtype]}

    coords = np.intersect1d(lat_coords.view(lat_dtype),
                            lon_coords.view(lon_dtype))

    print('done (%3.2f seconds)' % (time.time() - st))
    return coords

def get_coords_from_dataset(ds):

    st = time.time()
    print('--> extracting coordinates from dataset... ', end='', flush=True)



    variables = ds.variables
    if 'XLONG_M' in variables and 'XLAT_M' in variables:
        lats = variables['XLAT_M'][:]
        lons = variables['XLONG_M'][:]
    elif 'LATITUDE' in variables and 'LONGITUDE' in variables:
        lats = variables['LATITUDE'][:]
        lons = variables['LONGITUDE'][:]
    else:
        lats = []
        lons = []
    
    print('done (%3.2f seconds)' % (time.time() - st))
    return lats, lons
   
 
if __name__ == "__main__":
    test_file = '/home/acastronova/www.nco.ncep.noaa.gov/pmb/codes/nwprod/nwm.v1.2.2/parm/domain/Fulldom_hires_netcdf_1km.nc'
    bbox = (-99.108, 43.559, -98.944, 43.738)
   
    print('--> opening dataset') 
    ds = xr.open_dataset(test_file)

    lats, lons = get_coords_from_dataset(ds)

    coords = bbox_to_coords(lats, lons, bbox)
