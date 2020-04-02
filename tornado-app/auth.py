#!/usr/bin/env python3

import os
import tornado.auth
import tornado.web
import environment as env
from tornado.auth import OAuth2Mixin
from tornado.httputil import url_concat
from tornado.httpclient import HTTPRequest, AsyncHTTPClient
from tornado import gen
import json
from hs_restclient import HydroShare, HydroShareAuthOAuth2

#from tornado.log import app_log


class HydroShareMixin(OAuth2Mixin):
    _OAUTH_AUTHORIZE_URL = 'https://www.hydroshare.org/o/authorize'
    _OAUTH_ACCESS_TOKEN_URL = 'https://www.hydroshare.org/o/token'


class LoginHandler(tornado.web.RequestHandler, HydroShareMixin):

    def get(self):
        self.authorize_redirect(redirect_uri=env.oauth_callback_url,
                                client_id=env.oauth_client_id,
                                scope=[],
                                response_type='code')
        self.write('success')


class CallbackHandler(tornado.web.RequestHandler, HydroShareMixin):

    @gen.coroutine
    def get(self):

        # get the code send back from HydroShare
        code = self.get_argument("code", False)

        if not code:
            raise tornado.web.HTTPError(400, "oauth callback made without a token")

        http_client = AsyncHTTPClient()

        # build POST request parameters for token request
        params = dict(
            grant_type='authorization_code',
            code=code,
            client_id=env.oauth_client_id,
            client_secret=env.oauth_client_secret,
            redirect_uri=env.oauth_callback_url,
        )

        # build url with parameters included
        url = url_concat('https://www.hydroshare.org/o/token/',
                         params).split('?')


        # build token request
        req = HTTPRequest(url[0],
                          method="POST",
                          body=url[1],
                          headers={"Accept": "application/json"},
                          validate_cert=False,)

        # make token request and wait for response async
        resp = yield http_client.fetch(req)

        try:
            # load the response json
            token_dict = json.loads(resp.body.decode('utf8', 'replace'))

            # get the access token returned from HS
            access_token = token_dict['access_token']

            # verify that the login worked
            headers = {"Accept": "application/json",
                       "Authorization": "Bearer {}".format(access_token)
                       }
            req = HTTPRequest("https://hydroshare.org/hsapi/userInfo",
                              method="GET",
                              headers=headers
                              )
            resp = yield http_client.fetch(req)
            self.set_secure_cookie('user',
                                   json.dumps(token_dict))
            self.redirect('save-to-hydroshare')

        #    return 'test'

#            auth = HydroShareAuthOAuth2(env.oauth_client_id.client_id,
#                                        env.oauth_client_secret,
#                                        token=access_token)
#            hs = HydroShare(auth=auth)
#            for resource in hs.resources():
#                self.write(resource)
#            resp = yield http_client.fetch(req)
#            resp_json = json.loads(resp.body.decode('utf8', 'replace'))
#
#            # get the username variable from the response
#            username = resp_json["username"]
#
#            self.redirect('home')

        except Exception as e:
            # todo insert error page here
            self.write(e)
