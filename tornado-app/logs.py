#!/usr/bin/env python3

import os
import sys
import logging
import environment as env
from tornado.log import app_log, gen_log, access_log, LogFormatter




class Logs(object):

    if not os.path.exists(env.log_dir):
        os.makedirs(env.log_dir)

    format = '%(asctime)-15s %(levelname)s <%(module)s.py - %(funcName)s> '\
             '%(processName)s %(message)s'

    # prepare logs for tornado general
    formatter = LogFormatter(fmt=format, color=True)
    general_logger = logging.getLogger('tornado.general')
    general_logger.setLevel(env.general_level)
    general_logger.propagate = False

    fpath = os.path.join(env.log_dir, 'general.log')
    general_handler = logging.handlers.RotatingFileHandler(fpath,
                                                           'a',
                                                          env.log_file_size,
                                                          env.log_count)
    general_handler.setFormatter(formatter)
    general_logger.addHandler(general_handler)

    # prepare logs for tornado access
    access_formatter = LogFormatter(fmt=format, color=True)
    access_logger = logging.getLogger('tornado.access')
    access_logger.setLevel(env.access_level)
    access_logger.propagate = False

    fpath = os.path.join(env.log_dir, 'access.log')
    access_handler = logging.handlers.RotatingFileHandler(fpath,
                                                          'a',
                                                          env.log_file_size,
                                                          env.log_count)
    access_handler.setFormatter(access_formatter)
    access_logger.addHandler(access_handler)

    # prepare logs for tornado application
    application_formatter = LogFormatter(fmt=format, color=True)
    application_logger = logging.getLogger('tornado.application')
    application_logger.setLevel(env.application_level)
    application_logger.propagate = False

    fpath = os.path.join(env.log_dir, 'application.log')
    application_handler = logging.handlers.RotatingFileHandler(fpath,
                                                               'a',
                                                          env.log_file_size,
                                                          env.log_count)
    application_handler.setFormatter(application_formatter)
    application_logger.addHandler(application_handler)
