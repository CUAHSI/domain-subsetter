#!/usr/bin/env python3

import os
import json
import shutil
import tornado.auth
import tornado.web
import tornado.web
import tornado.auth
import environment as env
from .core import RequestHandler
from tornado.log import app_log, gen_log, access_log, LogFormatter
from tornado.log import enable_pretty_logging
enable_pretty_logging()
from hs_restclient import HydroShare, HydroShareAuthOAuth2


class HsAuthHandler(RequestHandler):
    def get_current_user(self):

        # get user credentials if they're already logged in
        user = self.get_secure_cookie('user')

        # login if user cookie is not found
        if user is None:
            # redirect to the login handler and pass the original url
            # as the "next" parameter
            self.redirect(f'/login?next={self.request.uri}')
        else:
            return user


class SaveToHydroShare(HsAuthHandler):
    @tornado.web.authenticated
    def get(self, uid):

        # render the save to hydroshare template
        self.render('save_to_hydroshare.html',
                    title='SaveToHydroShare')


#    @tornado.web.authenticated
#    def post(self):
#
#
#        import pdb; pdb.set_trace()
#
#        # get the input guid and resource_title which
#        # will be used to create a new HydroShare resource.
#        dat = self.get_secure_cookie('dat')
#        guid = dat['guid']
#        title = dat['title']
#
#        # delete the browser cookie
#        self.clear_cookie('dat')
#
##        guid = self.get_body_argument('guid')
##        title = self.get_body_argument('resource_title')
#
#        # get the user's oauth token
#        token = json.loads(self.current_user)
#
#        # connect with HydroShare
#        auth = HydroShareAuthOAuth2(env.oauth_client_id,
#                                    env.oauth_client_secret,
#                                    token=token)
#        hs = HydroShare(auth=auth)
#        ui = hs.getUserInfo()
#
#        # compress the subset output 
#        datapath = os.path.join(env.output_dir, guid)
#        shutil.make_archive(datapath, 'zip', datapath)
#        
#        # create the resource
#        resource_id = hs.createResource('CompositeResource',
#                                        title,
#                                        resource_file=f'{datapath}.zip',
#                                        keywords=['Parflow',
#                                                  'CUAHSI Subsetter'],
#                                        abstract='')
#        self.redirect(f'https://hydroshare.org/resource/{resource_id}')
#
#
#    @tornado.web.authenticated
#    def get(self):
#
#        import pdb; pdb.set_trace()
#
#        # get the user's oauth token
#        token = json.loads(self.current_user)
#
#        # connect with HydroShare
#        auth = HydroShareAuthOAuth2(env.oauth_client_id,
#                                    env.oauth_client_secret,
#                                    token=token)
#        hs = HydroShare(auth=auth)
#        ui = hs.getUserInfo()
#        self.write(ui)
##        for resource in hs.resources(owner='TonyCastronova',
##                                     count=1):
##            import pdb; pdb.set_trace()
##            self.write(resource)
##            break
#        


