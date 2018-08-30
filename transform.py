#!/usr/bin/env python3 

from pyproj import Proj, transform



def proj_to_coord(coords, insrs='epsg:3857', outsrs='epsg:4326'):
    import pdb; pdb.set_trace()
    inProj = Proj(init=insrs)
    outProj = Proj(init=outsrs)

    transformed = []
    for c in coords:
        x, y = c
        x2, y2 = transform(inProj, outProj, x1, y1)
        transformed.append(x2, y2)
    return transformed

