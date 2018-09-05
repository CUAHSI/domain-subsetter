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
            (r"/SubsetWithBbox", handlers.SubsetWithBbox),
            (r"/status", handlers.JobStatus),
            (r"/data/(.*)", tornado.web.StaticFileHandler, {"path": '/tmp'}),
        ]
        settings = {
            "debug":True,
#            "login_url":os.path.join(os.environ['JUPYTER_REST_IP'], ':%s' % os.environ['JUPYTER_PORT']),
#        "template_path":Settings.TEMPLATE_PATH,
#        "static_path":Settings.STATIC_PATH,
        }
        tornado.web.Application.__init__(self, endpoints, **settings)

def main():

    app = Application()
#    if int(os.environ['SSL_ENABLED']):
#        http_server = tornado.httpserver.HTTPServer(app, ssl_options={
#            "certfile": os.environ['SSL_CERT'],
#            "keyfile": os.environ['SSL_KEY']
#        })
#    else:
    http_server = tornado.httpserver.HTTPServer(app)

    http_server.listen(8080)
    print('\n'+'-'*60)
    print('server listening on 0.0.0.0:8080')
    print('-'*60+'\n')
    IOLoop.instance().start()

if __name__ == "__main__":
    main()
