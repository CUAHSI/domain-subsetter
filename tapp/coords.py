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

def get_proj_for_wgs84_bbox(filepath, bbox):

    ds = xr.open_dataset(filepath)

    print('--> calculating minimum and maximim lat/lons')

    minX, minY, maxX, maxY = bbox

#    print('--> input coordinates: ', end='')
#    print('(y-south: %3.2f, ' % (minY), end='')
#    print('y-north: %3.2f' % (maxY), end='')
#    print('x-west: %3.2f' % (minX), end='')
#    print('x-east: %3.2f)' % (maxX))

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

#    print('---> Bounding Box\n')
#    print('\t Lower col = %d%sUpper col = %d' % (col_lower, ' '*14, col_upper))
#    print('\t |%s|\n\t |%s|' % (' '*30, ' '*30))
#    print('\t *%s* - - Upper row = %d' % ('- '*15, row_upper))
#    print(('\t |' + ' '*30 + '|\n')*10, end='')
#    print('\t *%s* - - Lower row = %d' % ('- '*15, row_lower))

    # imin, jmin, imax, jmax
#    return (col_lower, row_lower, col_upper, row_upper)
    import pdb; pdb.set_trace()
    y_south = ds.y.values[row_lower]
    y_north = ds.y.values[row_upper]
    x_west = ds.x.values[col_lower]
    x_east = ds.x.values[col_upper]
    return (x_east, y_south, x_west, y_north)
