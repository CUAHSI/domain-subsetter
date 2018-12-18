#!/usr/bin/env python3


import os
import sys
import logging
import tornado.web
from tornado import httpserver
from tornado.ioloop import IOLoop
from tornado.log import app_log, gen_log, access_log, LogFormatter

import handlers


class Application(tornado.web.Application):
    def __init__(self):
        endpoints = [
            (r"/", handlers.IndexHandler),
            (r"/subset", handlers.Subset),
            (r"/nwm/v1_2_2/subset", handlers.SubsetNWM122),
            (r"/wbd/gethucbbox/lcc", handlers.LccBBoxFromHUC),
            (r"/jobs", handlers.Job),
            (r"/jobs/([a-f0-9]{40})", handlers.Job),
            (r"/admin/status", handlers.Status),
            (r"/status/([a-f0-9]{40})", handlers.Status),
            (r"/data/(.*)", tornado.web.StaticFileHandler,
             {"path": '/tmp'}),
            (r"/about", handlers.About),
            (r"/help", handlers.Help),
            (r"/api", handlers.Api),
            (r"/getting-started", handlers.GettingStarted),
        ]
        settings = {
            "debug":True,
            "static_path":os.path.join(os.path.dirname(__file__), "static"),
            "template_path":os.path.join(os.path.dirname(__file__), "templates"),
        }
        tornado.web.Application.__init__(self, endpoints, **settings)


def main():

    app = Application()
    http_server = tornado.httpserver.HTTPServer(app)

    # prepare logs for tornado general
    format = 'GENERAL: %(asctime)-15s %(message)s'
    formatter = LogFormatter(fmt=format, color=True)
    general_logger = logging.getLogger('tornado.general')
    general_handler = logging.StreamHandler(sys.stdout)
    general_handler.setFormatter(formatter)
    general_logger.addHandler(general_handler)

    # prepare logs for tornado access
    format = 'ACCESS: %(asctime)-15s %(message)s'
    access_formatter = LogFormatter(fmt=format, color=True)
    access_logger = logging.getLogger('tornado.access')
    access_handler = logging.StreamHandler(sys.stdout)
    access_handler.setFormatter(access_formatter)
    access_logger.addHandler(access_handler)

    # prepare logs for tornado application
    format = 'APPLICATION: %(asctime)-15s %(message)s'
    application_formatter = LogFormatter(fmt=format, color=True)
    application_logger = logging.getLogger('tornado.application')
    application_handler = logging.StreamHandler(sys.stdout)
    application_handler.setFormatter(application_formatter)
    application_logger.addHandler(application_handler)

    http_server.listen(8080)
    print('\n'+'-'*60)
    print('server listening on 0.0.0.0:8080')
    print('-'*60+'\n')
    IOLoop.instance().start()

if __name__ == "__main__":
    main()
