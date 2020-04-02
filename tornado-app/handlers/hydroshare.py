#!/usr/bin/env python3

import json
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
        return self.get_secure_cookie('user')


class SaveToHydroShare(HsAuthHandler):
    @tornado.web.authenticated
    def get(self):

        # get the user's oauth token
        token = json.loads(self.current_user)

        # connect with HydroShare
        auth = HydroShareAuthOAuth2(env.oauth_client_id,
                                    env.oauth_client_secret,
                                    token=token)
        hs = HydroShare(auth=auth)
#        hs.
        ui = hs.getUserInfo()
        self.write(ui)
#        for resource in hs.resources(owner='TonyCastronova',
#                                     count=1):
#            import pdb; pdb.set_trace()
#            self.write(resource)
#            break
        


