#!/usr/bin/env python3

import ogr
import osr
import itertools
from shapely import geometry
import xml.etree.ElementTree as ET


class WatershedBoundary(object):
    def __init__(self, srs=None):
        self.srs = srs
        self.polygons = {}
        self.polygons_object = None

    def set_srs_from_gml_polygon(self, gml):

        longsrs = gml.attrib['srsName']
        longsrs = longsrs.split('::')
        self.srs = (longsrs[0].split(':')[-1], longsrs[-1])

    def get_polygons(self):
        return self.polygons
    
    def get_polygon_object(self):
        return self.polygons_object

    def get_polygon_wkt(self):
        wkt = []
#        import pdb; pdb.set_trace()
        for hucid, poly_shape in self.polygons.items():
            wkt.append(poly_shape.wkt)
        return wkt

#        if len(self.polygons) == 1:
#            return list(self.polygons.values())[0][0].wkt
#        elif len(self.polygons) > 1:
#   
#            # create multipolygon
#            polys = list(itertools.chain.from_iterable(self.polygons.values()))
#            mp = geometry.MultiPolygon(polys)
#            return mp.wkt
#        else:
#            return None
        
    
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
  
        if len(polys) > 1:
            # create multipolygon
            plist = list(itertools.chain.from_iterable(self.polygons.values()))
            shape = geometry.MultiPolygon(plist)
        else:
            shape = polys[0]

        if hucname not in self.polygons.keys():
            self.polygons[hucname] = shape
        else:
            raise Exception(f'Huc already exists in WatershedBoundary: {hucname}')


    def write_shapefile(self, out_shp):
      

        driver = ogr.GetDriverByName('Esri Shapefile')
        ds = driver.CreateDataSource(out_shp)
        ref = None
        if self.srs is not None and self.srs[0] == 'EPSG':
            ref = osr.SpatialReference()
            ref.ImportFromEPSG(int(self.srs[1]))
        
        layer = ds.CreateLayer('', ref, ogr.wkbPolygon)

        # Add one attribute
        layer.CreateField(ogr.FieldDefn('id', ogr.OFTInteger))
        defn = layer.GetLayerDefn()
    
        for hucid, poly in self.polygons.items():
            # Create a new feature (attribute and geometry)
            feat = ogr.Feature(defn)
            feat.SetField('id', hucid)
    
            geom = ogr.CreateGeometryFromWkb(poly.wkb)
            feat.SetGeometry(geom)

            layer.CreateFeature(feat)
            feat = geom = None  # destroy these

        # Save and close everything
        ds = layer = feat = geom = None


