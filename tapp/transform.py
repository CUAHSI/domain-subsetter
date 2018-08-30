#!/usr/bin/env python3 

from pyproj import Proj, transform



def proj_to_coord(coords, insrs='+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ', outsrs='+proj=lcc +lat_1=20 +lat_2=60 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs'):
    inProj = Proj(insrs)
    outProj = Proj(outsrs)

    transformed = []
    for c in coords:
        lon, lat = c
        x, y = transform(inProj, outProj, lon, lat)
        transformed.append((x, y))
    return transformed

