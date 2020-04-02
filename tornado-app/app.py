#!/usr/bin/env python3


import os
import sys
import logging
import tornado.web
from tornado import httpserver
from tornado.ioloop import IOLoop

# import 'logs' before other modules
# to ensure logs are configured properly
import logs

from handlers import core, hydroshare
from handlers import pf1handlers, nwm122handlers, nwm2handlers
import environment as env
import auth

class Application(tornado.web.Application):
    def __init__(self):
        endpoints = [
            (r"/", core.IndexNew),
            # Utility Endpoints
            (r"/wbd/gethucbbox/lcc", core.LccBBoxFromHUC),
            (r"/jobs", core.Job),
            (r"/jobs/([a-f0-9]{40})", core.Job),
#            (r"/admin/status", core.Status),
#            (r"/status/([a-f0-9]{40})", core.Status),
            (r"/status", core.Status),
            (r"/data/(.*)", tornado.web.StaticFileHandler,
             {"path": env.output_dir}),
#            (r"/results/([a-f0-9]{40})", core.Results),
            (r"/results", core.Results),
            (r"/download-zip/([a-f0-9]{40})", core.GetZip),
            (r"/download-gzip/([a-f0-9]{40})", core.GetGzip),
            # Help Pages
            (r"/about", core.About),
            (r"/help", core.Help),
            (r"/api", core.Api),
            (r"/getting-started", core.GettingStarted),
            # Subsetting handlers
            (r"/parflow/v1_0", pf1handlers.Index),
            (r"/parflow/v1_0/subset", pf1handlers.SubsetParflow1),
            (r"/nwm/v1_2_2", nwm122handlers.Index),
            (r"/nwm/v1_2_2/subset", nwm122handlers.SubsetNWM122),
            (r"/nwm/v2_0", nwm2handlers.Index),
            (r"/nwm/v2_0/subset", nwm2handlers.SubsetNWM2),
            (r"/login", auth.LoginHandler),
            (r"/authorize", auth.CallbackHandler),
            (r"/save-to-hydroshare", hydroshare.SaveToHydroShare),
#            (r"/test", test.Index),


        ]
        settings = {
            "debug": env.debug,
            "static_path": env.static_path,
            "template_path": env.template_path,
            "login_url": "/login",
            "cookie_secret":env.cookie_secret,
        }
        tornado.web.Application.__init__(self, endpoints, **settings)


def main():

    app = Application()
    http_server = tornado.httpserver.HTTPServer(app)

    # initialize logs
    applogs = logs.Logs()

    http_server.listen(env.port, address=env.address)
    print('\n'+'-'*60)
    print('server listening on %s:%s' % (env.address, env.port))
    print('-'*60+'\n')
    IOLoop.instance().start()

if __name__ == "__main__":
    main()
