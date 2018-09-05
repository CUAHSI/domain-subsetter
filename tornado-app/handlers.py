#!/usr/bin/env python3

import time

import os
import json
import tornado.auth
import tornado.web
import uuid
import subprocess

import bbox
import transform

from tornado import gen 

from tornado.log import enable_pretty_logging
enable_pretty_logging()


#from tornado.web import asynchronous
#_workers = ThreadPool(10)
import jobs

#from tornado.queues import Queue
from tornado.concurrent import run_on_executor, futures
#from concurrent.futures import ThreadPoolExecutor

executor = jobs.BackgroundWorker()
executor.start()

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
        self.render("templates/index.html", title="CUAHSI Subsetter v0.1")
    
    def post(self):
        ulat = self.get_argument('ulat')
        llat = self.get_argument('llat')
        ulon = self.get_argument('ulon')
        llon = self.get_argument('llon')
        if '' in [ulat, ulon, llat, llon]:
            self.render("templates/index.html",
                        title="CUAHSI Subsetter v0.1",
                        msg='ERROR: Missing required input')
         
        query = 'llat=%s&llon=%s&ulat=%s&ulon=%s' % (llat, llon, ulat, ulon)
        self.redirect('SubsetWithBbox?%s' % query)
       
class JobStatus(RequestHandler):

    global executor

    def get(self):
        uid = self.get_arg_value('jobid', True)
        res = executor.poll(uid).result()
    
        print(res)
        status = res['state']
        self.render('templates/subset.html',
                    color='rgb(135, 247, 184)',
                    msg='Job status --> %s' % res['state'])

 
class SubsetWithBbox(RequestHandler):

#    executor = futures.ThreadPoolExecutor(4)
    global executor

    @tornado.gen.coroutine
    def get(self):
#        llat = self.get_arg_value('llat', True)
#        llon = self.get_arg_value('llon', True)
#        ulat = self.get_arg_value('ulat', True)
#        ulon = self.get_arg_value('ulon', True)

#        executor.submit(self.test)
#        self.test()

        # submit the job
        uid = executor.add(self.test, True).result()
        print('Job Submitted --> %s' % uid)

#        print(self.executor.poll(uid).result())

        self.render('templates/subset.html',
                    color='rgb(135, 247, 184)',
                    msg='Job Running: %s' % uid)

##        self.executor.submit(self.test)
##        yield self.test()
##        yield self.subset(llat, llon, ulat, ulon)
#

#    def finish(self):
#        print('finish')

#    @run_on_executor
    def test(self):
        x = 0
        for i in range(0,50000000):
            x = i

    @tornado.gen.coroutine
    def subset(self, llat, llon, ulat, ulon):

        # get arguments from the query string.
        # display an error if req args are missing.
        self.errors = []
#        llat = self.get_arg_value('llat', True)
#        llon = self.get_arg_value('llon', True)
#        ulat = self.get_arg_value('ulat', True)
#        ulon = self.get_arg_value('ulon', True)

#        # return an error if args are invalid        
#        response = self.check_for_errors()
#        if response:
#            self.response = response
#            self.write(json.dumps(response))
#            return

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
        self.write('validating bounding box')
        if (ysouth > ynorth) | (xwest > xeast):
            self.write('invalid bounding box')

        # create random guid
        self.write('creating uuid')
        uid = uuid.uuid4().hex
        uid = '0' + uid[1:]

        # run R script and save output as random guid
        self.write('invoking subsetting algorithm')

        cmd = ['Rscript',
               'subset_domain.R',
               uid,
               str(ysouth),
               str(ynorth),
               str(xwest),
               str(xeast)]
        print(' '.join(cmd))
        p = subprocess.Popen(cmd,
                             cwd=os.path.join(os.getcwd(),'r-subsetting'),
                             stdout=subprocess.PIPE,
                             stderr=subprocess.STDOUT)

        for line in iter(p.stdout.readline, b''):
            print(">>> " + line.decode('utf-8').rstrip())
        p.stdout.close()
        return_code = p.wait()

        if not return_code == 0:
            response = dict(message =
                'The process call "{}" returned with code {}, an error '
                'occurred.'.format(list(cmd), return_code),
                           status='error')
        else:
            fpath = os.path.join('/tmp', uid) 
            outname = '%s.tar.gz' % uid
            cmd = ['tar', '-czf', outname, fpath] 
            p = subprocess.Popen(cmd, cwd = '/tmp',
                             stdout=subprocess.PIPE,
                             stderr=subprocess.STDOUT)
            for line in iter(p.stdout.readline, b''):
                print("$ " + line.decode('utf-8').rstrip())
            p.stdout.close()
            return_code = p.wait()

            response = dict(message='file created at: /tmp/%s' % outname,
                            status='success')

        # return the response
  #      self.response = response
  #      self.write(json.dumps(response))
        return self.render('templates/subset.html')
