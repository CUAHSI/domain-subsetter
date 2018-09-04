#!/usr/bin/env python3

##############################################################################
# file name: bbox.py							     #
# author: Tony Castronova						     #
# organization: CUAHSI							     #
# description: utility functions for extract bounding boxes for shapefile    #
#              catchments, e.g. NHD					     #
##############################################################################

import os
import sys
import json
import time
import shutil
import zipfile
from osgeo import ogr
from glob import glob


def bboxs_from_shapefile(f, outpath):
    """computes the bounding box for each polygon in a shapefile.
    
    args: 
        f: input shapefile containing polygon features
        outpath: path to save bbox output in json format
    returns:
        True
    """

    # open the subwatershed file 
    infile = ogr.Open(f)
    layer = infile.GetLayer()
    feature_count = layer.GetFeatureCount()
    for i in range(0, feature_count):
        feature = layer.GetFeature(i)
    
        # extract the HUC8 id
        hucID = feature.GetField('HUC_12')
       
        print('--> [%d of %d] processing %s... ' % (i+1, feature_count, hucID), end='', flush=True)

        existing_bbox = {}
        if hucID in results:
           existing_bbox = results[hucID]

        # the NHD WBD shapefiles are in NAD83 coordinates
        # and might need to be converted into the srs of
        # the national water model domain files.
        spatialRef = layer.GetSpatialRef()

        # compute the bounding box for the content in this
        # shapefile. This will be stored and used later to
        # subset the NWM domain data
        geom = feature.GetGeometryRef()
        geom.GetEnvelope()
        xmin, xmax, ymin, ymax = geom.GetEnvelope()

        # compare against existing bbox if necessary
        if len(existing_bbox.keys()) > 0:
            xmin = min(xmin, existing_bbox['xmin'])
            ymin = min(ymin, existing_bbox['ymin'])
            xmax = max(xmax, existing_bbox['xmax'])
            ymax = max(ymax, existing_bbox['ymax'])


        # save this if it hasn't been processes before
        results[hucID] = dict(xmin=xmin,
                              ymin=ymin,
                              xmax=xmax,
                              ymax=ymax)
        
        print('done')

    # save the results
    with open(outpath, 'w') as json_file:
        json.dump(results, json_file)

    return True

if __name__ == "__main__":
    if os.path.exists('huc12-data.json'):
        with open('huc12-data.json', 'r') as f:
            results = json.load(f)
    else:
        results = {}
    
    if not os.path.exists('tmp'):
        os.mkdir('tmp')
    
    basedir = 'huc12'
    tmpdir = 'tmp'

    for f in glob(os.path.join(basedir, '*.shp')):
        try:
            bboxs_from_shapefile(f, 'huc12-data.json')
        except Exception:
            print('ERROR processing file: %s' % f)
    
    with open('huc12-data.json', 'r') as f:
        jdata = json.load(f)
        print('Number of records = %d' % len(jdata.keys()))
          
