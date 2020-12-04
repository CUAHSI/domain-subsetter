#!/usr/bin/env python3

import os
import re
import json
import shutil
import logging
import tornado.auth
import tornado.web
import tornado.web
import tornado.auth
import redislogger as rl
import environment as env
from .core import RequestHandler
from tornado.log import app_log, gen_log, access_log, LogFormatter
from tornado.log import enable_pretty_logging
enable_pretty_logging()
from hs_restclient import HydroShare, HydroShareAuthOAuth2

def get_logger(uid, log_file):
    logger = logging.getLogger(uid)
    logger.setLevel(logging.INFO)
    logger.propagate = False  # turns off console logging
    handler = logging.FileHandler(log_file)
    formatter = logging.Formatter('%(asctime)-15s %(levelname)s <%(module)s.py - %(funcName)s> %(processName)s %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # add redis handler
    rh = rl.RedisHandler(uid)
    rh.setLevel(logging.INFO)
    logger.addHandler(rh)

    return logger

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
    
        self.logger = get_logger(uid, env.hslogfile)

        # open the metadata file and extract info for the 
        # form text boxes
        with open(os.path.join(env.output_dir, uid, 'metadata.json'), 'r') as f:
            data = json.load(f)
        
        guid = uid
        title = f'Subset of {data["model"]} version {data["version"]}'
        keywords = [data["model"], data["version"], 'CUAHSI Subsetter']
        abstract = f"""{"-"*55}
                       This is an auto-generated abstract
                       {"-"*55}
        
                       This resource contains static domain data extracted  \
                       using the CUAHSI Subsetter (http://subset.cuahsi.org). \
                       Additional metadata regarding these data are listed \
                       below:

                       Model: {data["model"]}
                       Version: {data["version"]}
                       Date processed: {data["date_processed"]}
                       Included HUCs: {", ".join(data["hucs"])}
                    """

        # clean the abstract by removing tabs and extra spaces
        abstract = re.sub(' +', ' ', abstract.replace('\t', ''))

        # create hydroshare resource
        self.create_resource(guid, title, keywords, abstract)

    def create_resource(self, uid, title, keywords, abstract):

        # load user credentials
        self.logger.info('Connecting to the HydroShare API')
        token = json.loads(self.current_user)

        # connect with HydroShare
        auth = HydroShareAuthOAuth2(env.oauth_client_id, '', token=token)
        hs = HydroShare(auth=auth)

        # compress the subset output 
        self.logger.info('Compressing subset output as zip')
        datapath = os.path.join(env.output_dir, uid)
        shutil.make_archive(datapath, 'zip', datapath)

        # create the resource using the hsapi
        self.logger.info('Creating HydroShare resource')
        extra_metadata = '{"appkey": "MyBinder"}'
        resource_id = hs.createResource('CompositeResource',
                                        title,
                                        resource_file=f'{datapath}.zip',
                                        keywords=keywords,
                                        abstract=abstract,
                                        extra_metadata=extra_metadata,
                                        )

#        options = {
#                    "zip_with_rel_path": f"{uid}.zip",
#                    "remove_original_zip": True,
#                    "overwrite": False
#                  }
#        app_log.info('unzipping the HS content')
#        app_log.info(options)
#        result = hs.resource(resource_id).functions.unzip(options)
#        app_log.info(result)

        # redirect to the HS page when finished
        self.redirect(f'https://hydroshare.org/resource/{resource_id}?resource-mode=edit')
