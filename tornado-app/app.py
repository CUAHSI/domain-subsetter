#!/usr/bin/env python3


import os
from tornado.ioloop import IOLoop
from tornado import web, httpserver

# import 'logs' before other modules
# to ensure logs are configured properly
import logs

import auth
import websocket
import environment as env
from handlers import core, hydroshare, nldi
from handlers import pf1handlers, nwm122handlers, nwm2handlers


class Application(web.Application):
    def __init__(self):
        endpoints = [
            (r"/", core.Index),
            # Utility Endpoints
            (r"/wbd/gethucbbox/lcc", core.LccBBoxFromHUC),
            (r"/jobs", core.Job),
            (r"/jobs/([a-f0-9]{40})", core.Job),
#            (r"/admin/status", core.Status),
            (r"/status", core.Status),
            (r"/data/(.*)", web.StaticFileHandler, {"path": env.output_dir}),
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
            # HydroShare handlers
            (r"/login", auth.LoginHandler),
            (r"/authorize", auth.CallbackHandler),
            (r"/save-to-hydroshare/([a-f0-9]{40})", hydroshare.SaveToHydroShare),
            # Websocket endpoint for REDIS communication
            (r"/socket/([a-f0-9]{40})", websocket.SocketHandler),
            # HydroFrame login handlers
            (r"/hflogin", pf1handlers.HfLogin),
            (r"/hflogout", pf1handlers.HfLogout),
            (r"/hfisauthenticated", pf1handlers.HFIsAuthenticated),
            # NLDI
            (r'/nldi-trace', nldi.NLDI)
        ]
        settings = {
            "debug": env.debug,
            "static_path": env.static_path,
            "template_path": env.template_path,
            "login_url": "/login",
            "cookie_secret": env.cookie_secret,
        }
        web.Application.__init__(self, endpoints, **settings)


def main():

    app = Application()
    ssl = (env.ssl_cert, env.ssl_key)
    if all(ssl):
        http_server = httpserver.HTTPServer(
            app,
            ssl_options={
                "certfile": ssl[0],
                "keyfile": ssl[1],
            },
        )
    else:
        http_server = httpserver.HTTPServer(app)

    # initialize logs
    applogs = logs.Logs()

    # create output directory
    if not os.path.exists(env.output_dir):
        os.makedirs(env.output_dir)

    http_server.listen(env.port, address=env.address)
    print("\n" + "-" * 60)
    print("server listening on %s:%s" % (env.address, env.port))
    print("-" * 60 + "\n")
    IOLoop.instance().start()


if __name__ == "__main__":
    main()
