#!/usr/bin/env python3

import os
import jobs
import shutil
import hashlib
import tornado.web
import tornado.auth
import urllib.parse
import environment as env
from cas import CASClient
from subsetting import parflow1
from tornado.log import app_log
from tornado.log import enable_pretty_logging

enable_pretty_logging()
executor = jobs.BackgroundWorker()


class Index(tornado.web.RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):
        self.render("pfindex.html", title="PF-CONUS v1.0")

    def post(self):
        hucs = self.get_argument('hucs', True)

        # build GET url for subsetting
        query = f'hucs={hucs}'
        self.redirect('/parflow/v1_0/subset?%s' % query)

class HFIsAuthenticated(tornado.web.RequestHandler):
    """
    Endpoint used to update the Map display depending on whether or not
    the user has authenticated with a HydroFrame Account
    """
    def get(self):
        cas_username = self.get_secure_cookie('cas-username')
        
        if cas_username:
            self.write({'authenticated': True,
                        'username': cas_username.decode()})
        else:
            self.write({'authenticated': False})

class HfLogout(tornado.web.RequestHandler):
    """
    Endpoint for performing HydroFrame logout.
    When successful, a cookie is removed from the browser.
    """
    cas_client = CASClient(version=3,
                           service_url=env.cas_service_url,
                           server_url=env.cas_server_url)
    def get(self):
        cas_logout_url = self.cas_client.get_logout_url(self.request.headers.get('Referer'))
        self.clear_cookie('cas-username')
        return self.redirect(cas_logout_url)

class HfLogin(tornado.web.RequestHandler):
    """
    Endpoint for performing HydroFrame Authentication using CAS + DUO
    two-factor authentication. When successful, a cookie is set in the
    browser which can be checked via HFIsAuthenticated.
    """
    cas_client = CASClient(version=3,
                           service_url=env.cas_service_url,
                           server_url=env.cas_server_url)
    def get(self):
        next_url = self.get_argument('next',
                                     self.request.headers.get('Referer'))
                                     
        ticket = self.get_argument('ticket', None)
        cas_username = self.get_secure_cookie('cas-username')
        app_log.info(f'{next_url}, {ticket}, {cas_username}')
        
        if cas_username:
            return self.redirect(self.request.headers.get('Referer'))
        
        # perform CAS Authentication
        if ticket is None:
            app_log.info('no cas ticket found')
            
            # add the referrer url as the next url
            self.cas_client.service_url += f'?next={next_url}'

            # No ticket, the request come from end user, send to CAS login
            cas_login_url = self.cas_client.get_login_url()

            app_log.info(f'redirecting to {cas_login_url}')
            return self.redirect(cas_login_url)

        # There is a ticket, the request come from CAS as callback.
        # need call `verify_ticket()` to validate ticket and get user profile.
        user, attributes, pgtiou = self.cas_client.verify_ticket(ticket)
        if not user:
            return 'Failed to verify ticket. <a href="/login">Login</a>'
        else:
            app_log.info('setting cas-username cookie')
            self.set_secure_cookie('cas-username', user)
            return self.redirect(next_url)
        

class SubsetParflow1(tornado.web.RequestHandler):
    """
    Subsetting endpoint for ParFlow CONUS 1.0
    """

    @tornado.gen.coroutine
    def get(self):

        global executor

        hucs = self.get_argument('hucs', True, strip=True).split(',')
        app_log.info(f'subsetting PF-CONUS 1.0: {hucs}')

        # calculate unique hash based on bbox
        hasher = hashlib.sha1()
        hasher.update(str(hucs).encode('utf-8'))
        uid = hasher.hexdigest()

        # make a directory for the output
        # TODO: return existing directory rather than recreate it!
        # check if this job has been executed previously
        # app_log.debug('Checking if job exists')
        # res = sql.get_job_by_guid(uid)
        # app_log.debug(res)
        outdir = os.path.join(env.output_dir, uid)
        if os.path.exists(outdir):
            shutil.rmtree(outdir)
        os.mkdir(outdir)

        # Subset PF-CONUS 1.0
        app_log.info('Begin PF-CONUS 1.0 Subsetting')
        args = (uid, hucs, outdir)
        uid = executor.add(uid, parflow1.subset, *args)

        # redirect to status page for this job
        app_log.debug('redirecting to status page')
        self.redirect(f'/status?model=parflow&version=1&jobid={uid}')
