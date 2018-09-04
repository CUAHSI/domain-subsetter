#!/usr/bin/env python3  
import time
import numpy as np
import xarray as xr


def get_coordinate_variable(ds):
    var = ds.variables
    lat, lon = None, None
    if 'LATITUDE' in var and 'LONGITUDE' in var:
        lat='LATITUDE'
        lon='LONGITUDE'
    elif 'XLONG_M' in var and 'XLAT_M' in var:
        lat='XLAT_M'
        lon='XLONG_M'
    elif 'XLONG' in var and 'XLAT' in var:
        lat='XLAT'
        lon='XLONG'
    elif 'lat' in var and 'lon' in var:
        lat='lat'
        lon='lon'
    else:
        print('ERROR: Could not find LAT and LON variables to subset')
    return lat, lon

def get_indices_by_wgs84_bbox(ds, bbox):


    print('--> calculating minimum and maximim lat/lons')
    
    minX, minY, maxX, maxY = bbox

    print('--> input coordinates: ', end='')
    print('(y-south: %3.2f, ' % (minY), end='')
    print('y-north: %3.2f' % (maxY), end='') 
    print('x-west: %3.2f' % (minX), end='')
    print('x-east: %3.2f)' % (maxX))

    # get the names of the lat/lon variables.
    # this varies between wrfhydro files
    latv, lonv = get_coordinate_variable(ds)

    # determine minimum and maximum lat/lons
    print('---> loading lat/lon data')
    lats = ds[latv].values
    lons = ds[lonv].values

    print('---> finding nearest lat/lon indices')
    minlat = np.abs(lats - minY)
    minlon = np.abs(lons - minX)
    maxlat = np.abs(lats - maxY)
    maxlon = np.abs(lons - maxX)

    print('----> unraveling index coordinates')
    # Note: maxY_idx corresponds with the minimum latitude value,
    # likewise minY_idx corresponds with the maximum latitude value
    # based on the ordering of the gridded data
    minLoc = np.unravel_index(np.nanargmin(minlat + minlon), minlon.shape)
    maxLoc = np.unravel_index(np.nanargmin(maxlat + maxlon), maxlon.shape)

    if len(minLoc) > 2:
        minLoc = minLoc[1:]
    if len(maxLoc) > 2:
        maxLoc = maxLoc[1:]

    # get the min/max indices for array rows and cols
    row_upper = max([minLoc[0], maxLoc[0]])
    row_lower = min([minLoc[0], maxLoc[0]])
    col_upper = max([minLoc[1], maxLoc[1]])
    col_lower = min([minLoc[1], maxLoc[1]])

    print('---> Bounding Box\n')
    print('\t Lower col = %d%sUpper col = %d' % (col_lower, ' '*14, col_upper))
    print('\t |%s|\n\t |%s|' % (' '*30, ' '*30))
    print('\t *%s* - - Upper row = %d' % ('- '*15, row_upper))
    print(('\t |' + ' '*30 + '|\n')*10, end='') 
    print('\t *%s* - - Lower row = %d' % ('- '*15, row_lower))
   
    # imin, jmin, imax, jmax
    return (col_lower, row_lower, col_upper, row_upper)
    

def get_indices_by_bbox(ds, bbox, variable):

    # subset the dataset by bbox
    subset = subset_ds_by_lat_lon(ds, bbox)
    
    print('--> calculating array indices for bbox... ', end='', flush=True)
    t = time.time()

    # extract the data values for the given variable
    data = subset[variable].values

    # select indices for all non-nan data values
    indices = np.argwhere(~np.isnan(data))

    print('done')
    
    # index coordinate need to be reversed
    # since ds values are exported with a shape of (y,x)
    return list(zip(indices[:,1], indices[:,0]))

#def subset_ds_by_points(ds, indices):
#    print('--> subsetting pointwise... ', end='', flush=True)
#    t = time.time()
#    x, y = zip(*indices) 
#    
#    sub = ds.isel_points(x=x, y=y)
#    print('done (%3.2f seconds)' % (time.time() - t))
#    return sub

def subset_ds_by_index_bbox(netcdf_file_path, minx, maxx, miny, maxy, outfile=None):
    print('--> subsetting by index bbox... ', end='', flush=True)
    ds = xr.open_dataset(netcdf_file_path)
    t = time.time()
    if 'x' in ds.dims:
        sub = ds.isel(x=slice(minx, maxx), y=slice(miny, maxy))
    else:
        sub = ds.isel(west_east=slice(minx, maxx), south_north=slice(miny, maxy))
    print('done (%3.2f seconds)' % (time.time() - t))

    t = time.time()
    if outfile is None:
        outfile = os.path.join(netcdf_file_path[:-3], '-subset.nc')
    print('--> saving subset to %s... ' % outfile.split('/')[-1], end='', flush=True)
    sub.to_netcdf('%s' % outfile)
    print('done (%3.2f seconds)' % (time.time() - t))

    return sub

#def subset_ds_by_index_bounds(ds, indices):
#    print('--> subsetting by index bounds... ', end='', flush=True)
#    t = time.time()
#    x, y = zip(*indices) 
#    minx = min(x)
#    maxx = max(x)
#    miny = min(y)
#    maxy = max(y)
#    if 'x' in ds.dims:
#        sub = ds.isel(x=slice(minx, maxx), y=slice(miny, maxy))
#    else:
#        sub = ds.isel(west_east=slice(minx, maxx), south_north=slice(miny, maxy))
#
#    print('done (%3.2f seconds)' % (time.time() - t))
#    return sub
#
#def subset_ds_by_lat_lon(ds, bbox):
#    print('--> subsetting dataset... ', end='', flush=True)
#    t = time.time()
#
#    minX, minY, maxX, maxY = bbox
#    subset = None
#    lat, lon = None, None
#    var = ds.variables
#    if 'LATITUDE' in var and 'LONGITUDE' in var:
#        lat='LATITUDE'
#        lon='LONGITUDE'
#    elif 'XLONG_M' in var and 'XLAT_M' in var:
#        lat='XLAT_M'
#        lon='XLONG_M'
#    elif 'lat' in var and 'lon' in var:
#        lat='lat'
#        lon='lon'
#
#    if lat is not None and lon is not None:
#        subset = ds.where(
#                (ds[lat] > minY) &
#                (ds[lat] < maxY) &
#                (ds[lon] > minX) &
#                (ds[lon] < maxX))
##        subset = subset.dropna('x', 'all')
##        subset = subset.dropna('y', 'all')
#    else:
#        print('ERROR: Could not find LAT and LON variables to subset')
#
#    print('done (%3.2f seconds)' % (time.time() - t))
#    return subset




