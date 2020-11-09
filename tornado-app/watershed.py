#!/usr/bin/env python3

import ogr
import osr
import requests
import itertools
import urllib.parse
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
        for hucid, poly_shape in self.polygons.items():
            wkt.append(poly_shape.wkt)
        return wkt

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
        layer.CreateField(ogr.FieldDefn('ID', ogr.OFTInteger))
        layer.CreateField(ogr.FieldDefn('HUC_ID', ogr.OFTString))
        defn = layer.GetLayerDefn()
        shapeid = 0
        for hucid, poly in self.polygons.items():
            shapeid += 1

            # Create a new feature (attribute and geometry)
            feat = ogr.Feature(defn)
            feat.SetField('ID', shapeid)
            feat.SetField('HUC_ID', hucid)
    
            geom = ogr.CreateGeometryFromWkb(poly.wkb)
            feat.SetGeometry(geom)

            layer.CreateFeature(feat)
            feat = geom = None  # destroy these

        # Save and close everything
        ds = layer = feat = geom = None


def create_shapefile(uid, hucs, outpath, logger=None):
    if logger is None:
        from tornado.log import app_log
        logger = app_log

    watershed = WatershedBoundary()

    for huc in hucs:
        try:
            logger.info(f'Querying geometry of HUC:{huc}')

            host_url = 'https://arcgis.cuahsi.org/arcgis/services/US_WBD/HUC_WBD/MapServer/WFSServer?'
            huc_filter = "<ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>HUC12</ogc:PropertyName><ogc:Literal>"+huc+"</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>"
            defaultParameters = {'service' : 'WFS',
                                 'request' : 'GetFeature',
                                  'typeName' : 'HUC_WBD:HUC12_US',
                                  'SrsName' : 'EPSG:4326',
                                  'Filter' : huc_filter}
            params = urllib.parse.urlencode(defaultParameters)
            request_url = host_url + params
    
            response = requests.get(request_url, verify=False)
            xmlbody = response.text
            tree = ET.ElementTree(ET.fromstring(xmlbody))
            root = tree.getroot()
            namespaces = {'gml':'http://www.opengis.net/gml/3.2'}
            if watershed.srs is None:
                 watershed.set_srs_from_gml_polygon(root.findall('.//gml:Polygon', namespaces)[0])
            polygons_gml = root.findall('.//gml:Polygon//gml:posList', namespaces)
            watershed.add_boundary_from_gml(polygons_gml, huc)

        except Exception as e:
             logger.error("Error Building Shapefile: " + str(e))

    # write the shapefile   
    watershed.write_shapefile(outpath)

    logger.info(f'Shapefile written to: {outpath}')
    return outpath
