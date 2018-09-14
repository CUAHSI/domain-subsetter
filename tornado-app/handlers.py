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


import jobs
executor = jobs.BackgroundWorker()
#executor.start()

import sqldata
sql = sqldata.Connect()
sql.build()

import subset


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
        self.render("index.html", title="CUAHSI Subsetter v0.1")
    
    def post(self):
        ulat = self.get_argument('ulat')
        llat = self.get_argument('llat')
        ulon = self.get_argument('ulon')
        llon = self.get_argument('llon')
        if '' in [ulat, ulon, llat, llon]:
            self.render("index.html",
                        title="CUAHSI Subsetter v0.1",
                        msg='ERROR: Missing required input')
         
        query = 'llat=%s&llon=%s&ulat=%s&ulon=%s' % (llat, llon, ulat, ulon)
        self.redirect('SubsetWithBbox?%s' % query)


class Subset(RequestHandler):

    @tornado.gen.coroutine
    def get(self):
        global executor

        # collect rest arguments
        llat = self.get_arg_value('llat', True)
        llon = self.get_arg_value('llon', True)
        ulat = self.get_arg_value('ulat', True)
        ulon = self.get_arg_value('ulon', True)
        uid = uuid.uuid4().hex
        args = (uid,
                llat,
                llon,
                ulat,
                ulon)

        uid = executor.add(uid, subset.subset_by_bbox, *args)
                     
        self.write('spam and eggs')

class Jobs(RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        jobs = sql.get_jobs()
        if jobs is None:
            jobs = []
        self.render('jobs.html', jobs=jobs)

