#!/usr/bin/env python3


import os
import json
import tornado.auth
import tornado.web
import uuid


import rpy2.robjects as robjects
import bbox
import transform

from tornado.log import enable_pretty_logging
enable_pretty_logging()


def load_r(scriptpath, function):
    print(scriptpath)
    r_source = robjects.r['source']
    r_source(scriptpath)
    r_getname = robjects.globalenv[function]
    return r_getname

class RequestHandler(tornado.web.RequestHandler):
    errors = []

    def get_or_error(self, argname, strip=True):
        """
        This function gets a REST input argument or returns an error message if the argument is not found
        Arguments:
        argname -- the name of the argument to get
        strip -- indicates if the whitespace will be stripped from the argument
        """
        arg = self.get_argument(argname, default=None, strip=strip)
        if arg is None:
            error = 'Could not find required parameter "%s"' % argname
            self.render("index.html", header=header, args=args, error=error)
        return arg

    def get_arg_value(self, argname, isrequired, strip=True):
        arg = self.get_argument(argname, default=None, strip=strip)
        if arg is None and isrequired:
            error = 'Could not find required parameter "%s"' % argname
            self.errors.append(error)
        return arg
   
    def check_for_errors(self):
        response = False
        if len(self.errors) > 0:
            response = dict(message="invalid arguments", status="fail")
        return response
            

class IndexHandler(RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):
        response = {
                    'message': (
                      "Index page of the NWM subsetting API."
                     ),
                    'author': 'Tony Castronova'
                   }
        self.response = response
        self.write(json.dumps(response))


class SubsetWithBbox(RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):

        # get arguments from the query string.
        # display an error if req args are missing.
        self.errors = []
        llat = self.get_arg_value('llat', True)
        llon = self.get_arg_value('llon', True)
        ulat = self.get_arg_value('ulat', True)
        ulon = self.get_arg_value('ulon', True)

        # return an error if args are invalid        
        response = self.check_for_errors()
        if response:
            self.response = response
            self.write(json.dumps(response))
            return

        geofile = '/home/acastronova/www.nco.ncep.noaa.gov/pmb/codes/nwprod/nwm.v1.2.2/parm/domain/geo_em.d01_1km.nc'
        bbox = (float(llon),
                float(llat),
                float(ulon),
                float(ulat))
        coords = [(bbox[0], bbox[1]), # lower left
                  (bbox[2], bbox[3]), # upper left
                  (bbox[2], bbox[3]), # upper right
                  (bbox[0], bbox[1])] # lower right
        transformed = transform.proj_to_coord(coords)
        xs = [t[0] for t in transformed]
        ys = [t[1] for t in transformed]
        ysouth= min(ys)
        ynorth= max(ys)
        xwest = min(xs)
        xeast=  max(xs)

        # check that bbox is valid
        print('validating bounding box', flush=True)
        if (ysouth > ynorth) | (xwest > xeast):
            print('invalid bounding box')

        # create random guid
        print('creating uuid', flush=True)
        uid = uuid.uuid4().hex
        uid = '0' + uid[1:]

        # run R script and save output as random guid
        # load the R script
        print('loading r subsetting script', flush=True)
        subsetBBOX = load_r('r-subsetting/subset_domain.R', 'subsetBbox')
        print('invoking subsetting algorithm', flush=True)
        subset = subsetBBOX(uid,
                            ysouth,
                            ynorth,
                            xwest,
                            xeast)

        response = dict(message='subset complete')
        self.response = response
        self.write(json.dumps(response))
