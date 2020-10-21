#!/usr/bin/env python3

import json
import redis
import environment as env
from logging import StreamHandler

class RedisHandler(StreamHandler):

    def __init__(self, channel):
        StreamHandler.__init__(self)
        self.channel = channel
        self.redis = redis.Redis(env.redis_url, env.redis_port)

    def emit(self, record):
        msg = self.format(record)
        entry = json.dumps({'type': 'message',
                            'status': 'success',
                            'value': msg})
        self.redis.publish(self.channel, entry)

def test():
    import logging
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    rh = RedisHandler('075c7b7f5548c9d4414c1536cc238fc620f75851')
    rh.setLevel(logging.INFO)
    logger.addHandler(rh)
    logger.info('test')
