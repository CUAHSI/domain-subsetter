#!/usr/bin/env python3

import sys
import logging
from tornado.log import app_log, gen_log, access_log, LogFormatter




class Logs(object):

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
