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

        # open the metadata file and extract info for the 
        # form text boxes
        with open(os.path.join(env.output_dir, uid, 'metadata.json'), 'r') as f:
            data = json.load(f)

        dat = {'guid': uid,
               'title': f'Subset of {data["model"]} version {data["version"]}',
               'keywords': f'{data["model"]}, v{data["version"]}, CUAHSI Subsetter',
               'abstract': f'{"-"*55}\n' +
                           'This is an auto-generated abstract\n' +
                           f'{"-"*55}\n\n' +
                           f'This resource contains static domain data ' +
                           f'extracted using the ' +
                           f'<a href=http://subset.cuahsi.org> CUAHSI ' +
                           f'Subsetter </a>. Additional metadata regarding ' +
                           f'these data are listed below: \n\n' +
                           f'Model: {data["model"]} \n' +
                           f'Version: {data["version"]}\n' +
                           f'Date processed: {data["date_processed"]} \n' +
                           f'Included HUCs: {", ".join(data["hucs"])}'}
        
        # render the save to hydroshare template
        self.render('save_to_hydroshare.html',
                    title='SaveToHydroShare',
                    dat=dat)


    @tornado.web.authenticated
    def post(self, uid):


        # get form post parameters that
        # will be used to create a new HydroShare resource.
        app_log.info('getting post arguments')
        title = self.get_body_argument('title', strip=True)
        abstract = self.get_body_argument('abstract', strip=True)

        # TODO make sure there are no blank keywords
#        kws = self.get_body_argument('keywords', strip=True).split(',')
        keywords = [kw.strip() for kw in
                    self.get_body_argument('keywords').split(',')
                    if kw.strip() != '']

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
        app_log.info('loading user auth')

        # get the user's oauth token
        token = json.loads(self.current_user)

        # connect with HydroShare
        auth = HydroShareAuthOAuth2(env.oauth_client_id,
                                    '',
                                    token=token)
        hs = HydroShare(auth=auth)

        # compress the subset output 
        app_log.info('compressing subset output as zip')
        datapath = os.path.join(env.output_dir, uid)
        shutil.make_archive(datapath, 'zip', datapath)

        # create the resource
        app_log.info('creating hydroshare resource')

        # add binderHub as an extra metadata kvp
        extra_metadata = '{"appkey": "MyBinder"}'
        resource_id = hs.createResource('CompositeResource',
                                        title,
                                        resource_file=f'{datapath}.zip',
                                        keywords=keywords,
                                        abstract=abstract,
                                        extra_metadata=extra_metadata,
                                        )
        app_log.info(f'created hydroshare resource: {resource_id}')

#        options = {
#                    "zip_with_rel_path": f"{uid}.zip",
#                    "remove_original_zip": True,
#                    "overwrite": False
#                  }
#        app_log.info('unzipping the HS content')
#        app_log.info(options)
#        result = hs.resource(resource_id).functions.unzip(options)
#        app_log.info(result)

        app_log.info('redirecting to hs resource')
        self.redirect(f'https://hydroshare.org/resource/{resource_id}')
