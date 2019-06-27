#!/usr/bin/env python3

import itertools
from shapely import geometry
import xml.etree.ElementTree as ET


class WatershedBoundary(object):
    def __init__(self, srs=None):
        self.srs = srs
        self.polygons = {}

    def set_srs_from_gml_polygon(self, gml):

        longsrs = gml.attrib['srsName']
        longsrs = longsrs.split('::')
        self.srs = (longsrs[0].split(':')[-1], longsrs[-1])

    def get_polygons(self):
        return self.polygons

    def get_polygon_wkt(self):
        if len(self.polygons) == 1:
            return list(self.polygons.values())[0][0].wkt
        elif len(self.polygons) > 1:
   
            # create multipolygon
            polys = list(itertools.chain.from_iterable(self.polygons.values()))
            mp = geometry.MultiPolygon(polys)
            return mp.wkt
        else:
            return None
        
    
    def add_boundary_from_gml(self, gml, hucname):
        """
        Creates Shapely polygon objects from GML returned via ArcServer
        """
    
        polys = []
        namespaces = {'gml':'http://www.opengis.net/gml/3.2'}
        for polygon in gml:
            vertex_list = polygon.text.split(' ')
            vertex_list = [float(v) for v in vertex_list]
            coords = list(zip(vertex_list[0::2], vertex_list[1::2]))
            polys.append(geometry.Polygon(coords))
  
        if hucname not in self.polygons.keys():
            self.polygons[hucname] = polys
        else:
            raise Exception(f'Huc already exists in WatershedBoundary: {hucname}')


