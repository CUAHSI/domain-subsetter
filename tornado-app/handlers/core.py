#!/usr/bin/env python3

import os
import json
import tornado.auth
import tornado.web
import shutil
from datetime import datetime
import bbox
import environment as env

from tornado import gen 
import tornado.auth
from tornado.log import enable_pretty_logging
enable_pretty_logging()


import jobs
executor = jobs.BackgroundWorker()

import sqldata
sql = sqldata.Connect(env.sqldb)
sql.build()


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
            self.render("index.html", error=error)
        return arg

    def get_arg_value(self, argname, isrequired, default=None, strip=True):
        arg = self.get_argument(argname, default=default, strip=strip)
        if arg is None and isrequired:
            error = 'Could not find required parameter "%s"' % argname
            self.errors.append(error)
        return arg

    def check_for_errors(self):
        response = False
        if len(self.errors) > 0:
            response = dict(message="invalid arguments", status="fail")
        return response

class Index(RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):
        self.render("index.html", title="New Index Page")

class LccBBoxFromHUC(RequestHandler):
    """
    Get BBOX in Lambert Conformal Conic for given a HUC ID.
    """

    def get(self):
        hucstring = self.get_arg_value('hucID', True, default='', strip=True)
        hucs = hucstring.split(',')
        huclevels = [len(huc) for huc in hucs]
        box = bbox.get_bbox_from_hucs(huclevels, hucs)

        response = dict(hucID=hucs,
                        hucLevel=huclevels,
                        bbox=box)

        self.write(json.dumps(response))


class Status(RequestHandler):
    @gen.coroutine
    def get(self): #, jobid=None):
        self.render('status.html')


class Job(RequestHandler):
    @gen.coroutine
    def get(self, jobid=None):
        if jobid is None:
            self.get_all_jobs()
        else:
            self.get_job_by_id(jobid)

    @gen.coroutine
    def get_all_jobs(self):
        response = []
        jobs = sql.get_jobs()
        if jobs is None:
            response = []
        else:
            for job in jobs:
                fpath = self.get_file_url(job[2])
              
                # format dates nicely
                st = job[3]
                et = job[4]
                if st is not None:
                    st = datetime.strptime(st, '%Y-%m-%d %H:%M:%S.%f') \
                                 .strftime('%m-%d-%Y %H:%M:%S')
                if et is not None:
                    et = datetime.strptime(et, '%Y-%m-%d %H:%M:%S.%f') \
                                 .strftime('%m-%d-%Y %H:%M:%S')

                # build response object
                response.append(dict(id=job[0],
                                     status=job[1],
                                     file=fpath,
                                     start=st,
                                     end=et))
        # return serialized data
        self.write(json.dumps(response))
        self.finish()

    @gen.coroutine
    def get_job_by_id(self, jobid):
        response = None

        # todo: remove this loop and replace with a sqldata.get_job_by_guid.
        jobs = sql.get_jobs()
        for job in jobs:
            if jobid == job[0]:
                fpath = self.get_file_url(job[2])

                # format dates nicely
                st = job[3]
                et = job[4]
                if st is not None:
                    st = datetime.strptime(st, '%Y-%m-%d %H:%M:%S.%f') \
                                 .strftime('%m-%d-%Y %H:%M:%S')
                if et is not None:
                    et = datetime.strptime(et, '%Y-%m-%d %H:%M:%S.%f') \
                                 .strftime('%m-%d-%Y %H:%M:%S')

                # build response object
                response = dict(id=job[0],
                                status=job[1],
                                file=fpath,
                                start=st,
                                end=et)
                continue
        if response is None:
            response = dict(message='Job Not Found',
                            status='error')

        self.write(json.dumps(response))
        self.finish()

    def get_file_url(self, relative_file_path):
        if relative_file_path.strip() != '':
            host_url = "{protocol}://{host}".format(**vars(self.request))
            return host_url + relative_file_path
        return None

class Results(RequestHandler):
    @gen.coroutine
    def get(self):
        model = self.get_argument('model', None)
        jobid = self.get_argument('jobid', None)
        version = self.get_argument('version', None)
        if (model is None) or (jobid is None) or (version is None):
            self.write('Operation aborted: Missing arguments. Must provide "model", "version", and "jobid"')
        elif not os.path.exists(os.path.join(env.output_dir, jobid)):
            self.write(f'Could not find job id: {jobid}')
            self.finish()

        # render results page based on model and version
        template = None
        version = float(version)
        if model.lower() == 'parflow':
            if version == 1.0:
                template = 'results_pf1.html'
        elif model.lower() == 'nwm':
            if version == 1.2:
                template = 'results_nwm1_2.html'
            if version == 2.0:
                # todo: update this template for nwm 2.0
                template = 'results_nwm1_2.html'

        # render an error if template is not found.
        if template is None:
            self.write('Operation aborted: Invalid arguments provided')
            self.finish()

        # render the template
        self.render(template,
                    jobid=jobid,
                    title='Results')


class GetZip(RequestHandler):
    @gen.coroutine
    def get(self, uid):
        host_url = "{protocol}://{host}".format(**vars(self.request))
        path = os.path.join(env.output_dir, uid)
        shutil.make_archive(path, 'zip', path)
        self.redirect(f'{host_url}/data/{path}.zip')


class GetGzip(RequestHandler):
    @gen.coroutine
    def get(self, uid):
        host_url = "{protocol}://{host}".format(**vars(self.request))
        path = os.path.join(env.output_dir, uid)
        shutil.make_archive(path, 'gztar', path)
        self.redirect(f'{host_url}/data/{path}.tar.gz')


class About(RequestHandler):
    @gen.coroutine
    def get(self):
        self.render('about.html', title='About')


class Help(RequestHandler):
    @gen.coroutine
    def get(self):
        self.render('help.html', title='Help')


class Api(RequestHandler):
    @gen.coroutine
    def get(self):
        self.render('api.html', title='API Documentation')


class GettingStarted(RequestHandler):
    @gen.coroutine
    def get(self):
        self.render('getting-started.html', title='Getting Started')
