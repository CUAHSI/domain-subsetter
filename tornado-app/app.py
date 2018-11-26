#!/usr/bin/env python3


import os
import tornado.web
from tornado import httpserver
from tornado.ioloop import IOLoop
from tornado.log import enable_pretty_logging


import handlers


class Application(tornado.web.Application):
    def __init__(self):
        endpoints = [
            (r"/", handlers.IndexHandler),
            (r"/subset", handlers.Subset),
            (r"/nwm/v1_2_2/subset", handlers.SubsetNWM122),
            (r"/wbd/gethucbbox/lcc", handlers.LccBBoxFromHUC),
            (r"/jobs", handlers.Job),
            (r"/jobs/([a-f0-9]{32})", handlers.Job),
            (r"/admin/status", handlers.Status),
            (r"/status/([a-f0-9]{32})", handlers.Status),
            (r"/data/(.*)", tornado.web.StaticFileHandler,
             {"path": '/tmp'}),
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

    http_server.listen(8080)
    print('\n'+'-'*60)
    print('server listening on 0.0.0.0:8080')
    print('-'*60+'\n')
    IOLoop.instance().start()

if __name__ == "__main__":
    main()
