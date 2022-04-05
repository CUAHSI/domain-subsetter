#!/usr/bin/env python3
from pathlib import Path
from os import environ as env
import tornado
from tornado.ioloop import IOLoop
from tornado import web, httpserver

# import 'logs' before other modules
# to ensure logs are configured properly
# import logs

# import auth
# import websocket
# import environment as env
from handlers import About, Api, GettingStarted, Help, Index

# from handlers import pf1handlers, nwm122handlers, nwm2handlers

# works
# Frontend
# "/"
# "/about"
# "/help"
# "/api"
# "/parflow/v1_0"
# "/nwm/v1_2_2"
# "/nwm/v2_0"


def get_app() -> web.Application:
    settings = {
        "debug": env.get("debug", True),
        "static_path": env.get("static_path", "static"),
        "template_path": env.get("template_path", "templates"),
        "login_url": "/login",
        "cookie_secret": env.get("cookie_secret", None),
    }
    return web.Application(
        [
            (r"/", Index),
            # Help Pages
            (r"/about", About),
            (r"/api", Api),
            (r"/getting-started", GettingStarted),
            (r"/help", Help),
            # (r"/maptest", core.MapTest),
            # (r"/parflow/v1_0", pf1handlers.Index),
            # (r"/nwm/v1_2_2", nwm122handlers.Index),
            # (r"/nwm/v2_0", nwm2handlers.Index),
        ],
        **settings,
    )


def main():

    # app = Application()
    # ssl = (env.ssl_cert, env.ssl_key)
    # if all(ssl):
    #     http_server = httpserver.HTTPServer(
    #         app,
    #         ssl_options={
    #             "certfile": ssl[0],
    #             "keyfile": ssl[1],
    #         },
    #     )
    # else:

    app = get_app()
    http_server = httpserver.HTTPServer(app)

    # initialize logs
    # applogs = logs.Logs()

    host = env.get("host", "0.0.0.0")
    port = int(env.get("port", 8080))

    http_server.listen(address=host, port=port)
    print("\n" + "-" * 60)
    print(f"server listening on {host}:{port}")
    print("-" * 60 + "\n")
    IOLoop.instance().start()


if __name__ == "__main__":
    main()
