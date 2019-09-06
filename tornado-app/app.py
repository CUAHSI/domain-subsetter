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

from handlers import handlers
from handlers import pf1handlers
import environment as env


class Application(tornado.web.Application):
    def __init__(self):
        endpoints = [
            (r"/", handlers.IndexHandler),
            (r"/nwm/v1_2_2/subset", handlers.SubsetNWM122),
            (r"/wbd/gethucbbox/lcc", handlers.LccBBoxFromHUC),
            (r"/jobs", handlers.Job),
            (r"/jobs/([a-f0-9]{40})", handlers.Job),
            (r"/admin/status", handlers.Status),
            (r"/status/([a-f0-9]{40})", handlers.Status),
            (r"/data/(.*)", tornado.web.StaticFileHandler,
             {"path": env.output_dir}),
            (r"/results/([a-f0-9]{40})", handlers.Results),
            (r"/about", handlers.About),
            (r"/help", handlers.Help),
            (r"/api", handlers.Api),
            (r"/getting-started", handlers.GettingStarted),
            (r"/parflow/v1_0", pf1handlers.Index),
            (r"/parflow/v1_0/subset", pf1handlers.SubsetParflow1),
        ]
        settings = {
            "debug": env.debug,
            "static_path": env.static_path,
            "template_path": env.template_path,
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
