#!/usr/bin/env python3


import os
import uuid
import falcon
import coords
import rpy2.robjects as robjects


def load_r(scriptpath, function):
    r_source = robjects.r['source']
    r_source(scriptpath)
    r_getname = robjects.globalenv[function]
    return r_getname



class Index:
    def on_get(self, req, resp):
        """Handles GET requests"""
        response = {
            'message': (
                "Index page of the NWM subsetting API."
            ),
            'author': 'Tony Castronova'
        }

        resp.media = response

class SubsetWithBbox:
    def on_get(self, req, resp):
        """Subsets the NWM domain files for a given bounding box
        Args:
          - llat: lower latitude in WGS 1984, e.g. 38.433
          - llon: lower longitude in WGS 1984, e.g. -90.5734
          - ulat: upper latitude in WGS 1984, e.g. 38.828
          - ulon: upper longitude  in WGS 1984, e.g. -89.911
        Returns:
          - subsetted NWM domain files compressed as tar.gz
        """

        # get input parameters
        params = {}
        req.get_param('llat', required=True, store=params) 
        req.get_param('llon', required=True, store=params) 
        req.get_param('ulat', required=True, store=params) 
        req.get_param('ulon', required=True, store=params) 
        

        # check that types are valid
        try:
            for k,v in params.items():
                params[k] = float(v)
        except Exception as e:
            resp.status = falcon.HTTP_400
            print('bounding box parameters must be of type:float')
            return
        
        # check that bbox is valid
        if (params['llon'] > params['ulon']) | (params['llat'] > params['ulat']):
            resp.status = falcon.HTTP_400
            print('invalid bounding box')

#        bbox = (params['llon'],
#                params['llat'],
#                params['ulon'],
#                params['ulat'])
#        geopath = '/home/acastronova/www.nco.ncep.noaa.gov/pmb/codes/nwprod/nwm.v1.2.2/parm/domain/Fulldom_hires_netcdf_250m.nc'
#        x_east, y_south, x_west, y_north = coords.get_proj_for_wgs84_bbox(geopath, bbox)
#
#        response = (x_east, x_west, y_south, y_north)

        # create random guid
        uid = uuid.uuid4().hex
        uid = '0' + uid[1:]

        # run R script and save output as random guid
	#    placeholder ###################
        f1 = '/tmp/file1.txt'
        f2 = '/tmp/file2.txt'
        ofile = '/tmp/%s.zip' % uid
        os.system('echo this is some text > %s' % f1)
        os.system('echo this is some text > %s' % f2)
        os.system('zip %s %s %s' % (ofile, f1, f2))
#        os.system('tar -czf /tmp/%s.tar.gz %s %s' % (uid, f1, f2))
	#    placeholder ###################


        # return data
        resp.content_type = 'application/zip'
        with open(ofile, 'rb') as f:
            resp.body = f.read()

#        # load the R script
#        getHouse = load_r('test.R', 'getHouse')
#    
#        house = str(getHouse(1)).split('"')[1]
#        response = '  '.join([str(house)] * 500)

