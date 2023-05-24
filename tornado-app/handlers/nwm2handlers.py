#!/usr/bin/env python3

import os
import tornado.auth
import tornado.web
import hashlib
import environment as env
from datetime import datetime
from subsetting import nwm200
from tornado.log import app_log, gen_log, access_log, LogFormatter
from tornado.log import enable_pretty_logging
enable_pretty_logging()


import jobs
executor = jobs.BackgroundWorker()

import sqldata
sql = sqldata.Connect(env.sqldb)
sql.build()


class Index(tornado.web.RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):
        self.render("nwmindex.html", title="NWM v2.0")

    def post(self):
        ulat = self.get_argument('ulat')
        llat = self.get_argument('llat')
        ulon = self.get_argument('ulon')
        llon = self.get_argument('llon')
        hucs = self.get_argument('hucs')

        if '' in [ulat, ulon, llat, llon]:
            self.render("index.html",
                        title="CUAHSI Subsetter v0.1",
                        msg='ERROR: Missing required input')

        # build GET url for subsetting
        query = f'llat={llat}&llon={llon}&ulat={ulat}&ulon={ulon}&hucs={hucs}'
        self.redirect('/nwm/v2_0/subset?%s' % query)


class SubsetNWM2(tornado.web.RequestHandler):
    """
    Subsetting endpoint for NWM v2.0
    """

    @tornado.gen.coroutine
    def get(self):
        global executor

        app_log.debug('SubsetNWM2.0 function')

        # collect rest arguments
        llat = self.get_argument('llat', True)
        llon = self.get_argument('llon', True)
        ulat = self.get_argument('ulat', True)
        ulon = self.get_argument('ulon', True)
        hucs = self.get_argument('hucs', True, strip=True).split(',')

        app_log.debug('submitted bbox: (%s, %s, %s, %s) ' %
                      (llat, llon, ulat, ulon))

        # calculate unique hash based on bbox
        hasher = hashlib.sha1()
        hasher.update(str([llon, llat, ulon, ulat]).encode('utf-8'))
        uid = hasher.hexdigest()

        # check if this job has been executed previously
        app_log.debug('Checking if job exists')
        res = sql.get_job_by_guid(uid)
        app_log.debug(res)
        
        # check that the file still exists on the system
        if len(res) > 0:

            fpath = res[0][2]
            if not os.path.exists(fpath):
                app_log.debug(f'Could not find results from job: {uid}')

                # clear the res array because this location must be processed again.
                res = []

        # submit the job
        if len(res) == 0:

            # submit the subsetting job
            args = (uid, llat, llon, ulat, ulon, hucs)
            uid = executor.add(uid, nwm200.subset_nwm_200, *args)
        else:

            # save a record of this request even though it was retrieved from cache
            t = datetime.now()
            sql.save_job(uid, 'finished', fpath, t, t)

        # redirect to status page for this job
        app_log.debug('redirecting to status page')
        self.redirect(f'/status?model=nwm&version=2.0&jobid={uid}')
