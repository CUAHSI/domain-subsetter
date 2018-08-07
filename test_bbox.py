#!/usr/bin/env python3

##############################################################################
# file name: test_bbox.py						     #
# author: Tony Castronova						     #
# organization: CUAHSI							     #
# description: script for generating GIS data for validating the the accuracy#
#              of the bbox calculations.			     	     #
##############################################################################

import os
import json
import time
import shutil
import random
import zipfile
from glob import glob
from osgeo import ogr


def create_validation_data(json_path, data_path, validation_path, num_datasets=10):   
    """constructs polygon and bbox shapefiles for a random set of features.
    Args:
        json_path: path to the json file containing catchment bounding boxes
        data_path: path to the input shapefile that defines catchment geometries
        validation_path: path to store the output files required for validation
        num_datasets: number of features to sample in the data file (default=10)
    """
    
    # open the subwatershed file
    infile = ogr.Open(data_path)
    layer = infile.GetLayer()
    feature_count = layer.GetFeatureCount()
    random.seed(time.time())
    idxs = random.sample(range(0, feature_count), num_datasets)
    

    # load json data
    with open(json_path, 'r') as jf:
        dat = json.load(jf)

    hucids = []
    
    for i in idxs:
        feature = layer.GetFeature(i)
    
        # extract the HUC8 id
        hucID = feature.GetField('HUC_12')
        hucids.append(hucID)
    
        print('--> exporting geometry for %s... ' % (hucID))
    
        wkb = feature.GetGeometryRef().ExportToWkb()
    
        # create shapefile from bbox data
        driver = ogr.GetDriverByName('Esri Shapefile')
        ds = driver.CreateDataSource(os.path.join(validation_path, '%s.shp' % hucID))
        lyr = ds.CreateLayer('', None, ogr.wkbPolygon)
        lyr.CreateField(ogr.FieldDefn('id', ogr.OFTInteger))
        defn = lyr.GetLayerDefn()
    
        # Create a new feature (attribute and geometry)
        feat = ogr.Feature(defn)
        feat.SetField('id', 123)
    
        # Make a geometry
        geom = ogr.CreateGeometryFromWkb(wkb)
        feat.SetGeometry(geom)
    
        lyr.CreateFeature(feat)
        feat = geom = None  # destroy these
    
        # Save and close everything
        ds = lyr = feat = geom = None
    
    for rk in hucids:
        
        print('--> exporting bbox for %s... ' % (rk))

        # create shapefile from bbox data
        driver = ogr.GetDriverByName('Esri Shapefile')
        ds = driver.CreateDataSource(os.path.join(validation_path, '%s_bbox.shp' % rk))
        layer = ds.CreateLayer('', None, ogr.wkbPolygon)
        layer.CreateField(ogr.FieldDefn('id', ogr.OFTInteger))
        defn = layer.GetLayerDefn()
        
        # Create a new feature (attribute and geometry)
        feat = ogr.Feature(defn)
        feat.SetField('id', 123)
        
        # Make a geometry
        ring = ogr.Geometry(ogr.wkbLinearRing)
        ring.AddPoint((dat[rk]['xmin']), (dat[rk]['ymin']))
        ring.AddPoint((dat[rk]['xmax']), (dat[rk]['ymin']))
        ring.AddPoint((dat[rk]['xmax']), (dat[rk]['ymax']))
        ring.AddPoint((dat[rk]['xmin']), (dat[rk]['ymax']))
        ring.AddPoint((dat[rk]['xmin']), (dat[rk]['ymin']))
        geom = ogr.Geometry(ogr.wkbPolygon)
        geom.AddGeometry(ring)
        feat.SetGeometry(geom)
        
        layer.CreateFeature(feat)
        feat = geom = None  # destroy these
        
        # Save and close everything
        ds = layer = feat = geom = None
    
if __name__ == "__main__":
 
    json_path = 'huc12-data.json'
    data_path = 'huc12/WBDSnapshot_National.shp'
    validation_path = 'validation_data'
    num = 10
    
    # make directory for validation data
    print('making output directory...', end='', flush=True)
    if os.path.exists(validation_path):
        shutil.rmtree(validation_path)
    os.mkdir(validation_path)
    print('done')
    
    # create validation files
    create_validation_data(json_path, data_path, validation_path, num)   


