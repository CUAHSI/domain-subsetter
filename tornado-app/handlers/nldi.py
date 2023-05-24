#!/usr/bin/env python3

"""
This file contains tornado handler(s) for watershed tracing using the NLDI.
"""

import json
import tornado.web
from nldi_navigator import navigator

from tornado.log import app_log
from tornado.log import enable_pretty_logging
enable_pretty_logging()


class NLDI(tornado.web.RequestHandler):

    def set_default_headers(self):
        self.set_header("Content-Type", 'application/json')

    def get(self):
        site = self.get_argument('site', None)
        site_provider = self.get_argument('site_provider', None)

        # exit early if site and site_provider don't exist
        if (site is None) or (site_provider is None):
            # return error
            app_log.debug(f'Error, neither huc12 nor usgs_gage argument was provided.')
            res = json.dumps({})
            self.write(res)
       
        response = navigator.get_flowlines_by_direction(
                site,
                navigation='UT',
                site_provider=site_provider,
                search_distance=999, # upstream search distance, 999 is the max.
        )
        
        self.write(response.to_json(drop_id=True))
