#!/usr/bin/env python3 


import argparse
from pyproj import Proj, transform


# WRF SRS as defined by the Full Dom NCFile
wrf_srs = '+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40.0000076293945 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs'
# OpenStreet map uses WGS 1984 coordinate system
wgs_1984 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '
# Leaflet uses 3857, but this isn't working for us. Possibly overridden by
# OpenStreet map.
epsg_3857 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'


def proj_to_coord(coords,
                  insrs=wgs_1984,
                  outsrs=wrf_srs):
    inProj = Proj(insrs)
    outProj = Proj(outsrs)

    transformed = []
    for c in coords:
        lon, lat = c
        x, y = transform(inProj, outProj, lon, lat)
        transformed.append((x, y))
    return transformed

def get_bounding_box(coords):
    xcoords = [c[0] for c in coords]
    ycoords = [c[1] for c in coords]
    minx = min(xcoords)
    miny = min(ycoords)
    maxx = max(xcoords)
    maxy = max(ycoords)

    return [(minx, miny), # lower left
            (minx, maxy), # upper left
            (maxx, maxy), # upper right
            (maxx, miny)] # lower right



if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Just a simple coordinate transformation utility.')
    parser.add_argument('--lat', help='latitude', required=True)
    parser.add_argument('--lon', help='longitude', required=True)
    parser.add_argument('--srs-in', help='proj4 srs string of input coordinates',
                        default='+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
    parser.add_argument('--srs-out', help='proj4 srs string for output coordinates',
                        default='+proj=lcc +lat_1=20 +lat_2=60 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs')
    args = parser.parse_args()
   
    lats = [float(lat) for lat in args.lat.split(',')]
    lons = [float(lon) for lon in args.lon.split(',')]

    incoords = list(zip(lons, lats)) 
 
    coords = proj_to_coord(incoords, args.srs_in, args.srs_out)
    print('\nTransformed Coordinates:')
    print('X,Y')
    for c in coords:
        print('%3.5f,%3.5f' % (c[0], c[1]))

    if len(coords) == 4:
        bbox = get_bounding_box(coords)
        print('\nBounding Box Coordinates:')
        print('X,Y')
        for c in bbox:
            print('%3.5f,%3.5f' % (c[0], c[1]))
