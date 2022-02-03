#!/usr/bin/env python3

import tornado.auth
import tornado.web
import hashlib
import environment as env
from subsetting import nwm122
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
        self.render("nwmindex.html", title="NWM v1.2.2")

    def post(self):
        ulat = self.get_argument('ulat')
        llat = self.get_argument('llat')
        ulon = self.get_argument('ulon')
        llon = self.get_argument('llon')
        hucs = self.get_argument('hucs', default=[])

        if '' in [ulat, ulon, llat, llon]:
            self.render("index.html",
                        title="CUAHSI Subsetter v0.1",
                        msg='ERROR: Missing required input')

        # build GET url for subsetting
        query = f'llat={llat}&llon={llon}&ulat={ulat}&ulon={ulon}&hucs={hucs}'
        self.redirect('/nwm/v1_2_2/subset?%s' % query)


class SubsetNWM122(tornado.web.RequestHandler):
    """
    Subsetting endpoint for NWM v1.2.2
    """

    @tornado.gen.coroutine
    def get(self):
        global executor

        app_log.debug('SubsetNWM122 function')

        # collect rest arguments
        llat = self.get_argument('llat', True)
        llon = self.get_argument('llon', True)
        ulat = self.get_argument('ulat', True)
        ulon = self.get_argument('ulon', True)
        hucs = self.get_argument('hucs', '', strip=True).split(',')

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

        # submit the job
        if len(res) == 0:

            # submit the subsetting job
            args = (uid, llat, llon, ulat, ulon, hucs)
            uid = executor.add(uid, nwm122.subset_nwm_122, *args)

        # redirect to status page for this job
        app_log.debug('redirecting to status page')
        self.redirect(f'/status?model=nwm&version=1.2&jobid={uid}')
