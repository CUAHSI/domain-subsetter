#!/usr/bin/env python

import json
import asyncio
import aioredis
import tornado.web
import tornado.websocket
from tornado.ioloop import IOLoop

from tornado.log import app_log
from tornado.log import enable_pretty_logging
enable_pretty_logging()

import environment as env

class Message(object):

    def __init__(self, json_message):
        self.__dat = json.loads(json_message)

    @property
    def type(self):
        return self.__dat['type']

    @property
    def channel(self):
        return self.__dat['channel']

    @property
    def value(self):
        return self.__dat['value']

    @property
    def status(self):
        return self.__dat['status']

    @property
    def success(self):
        if self.__dat['status'] != 'failed':
            return True
        return False

    @property
    def error_message(self):
        if (self.status == 'error') or (self.status == 'failed'):
            return self.value
        return None


class SocketHandler(tornado.websocket.WebSocketHandler):

    async def open(self, uid):

        # use the UID sent from the client to filter REDIS messages
        self.channel = uid

        # instantiate pubsub listener in the background
        IOLoop.current().spawn_callback(self.pubsub)
        await asyncio.sleep(0.1)

        app_log.info(f'new connection listening on channel: {self.channel}')
        app_log.info('WebSocket Opened')

    def on_close(self):
        app_log.info(f'WebSocket Closed: {self.channel}')

    def on_message(self, message):

        if message.success:
            self.write_message(message.value)

    def check_origin(self, origin):
        return True

    async def pubsub(self):
        """
        Program entry point. Establishes connection with REDIS and then
        invokes the listener function.
        """
        sub = await aioredis.create_redis(f'redis://{env.redis_url}:'
                                          f'{env.redis_port}')

        # connect to the channel defined by the connection's UUID
        subs = await sub.subscribe(self.channel)
        ch1 = subs[0]

        # invoke the listener function
        await self.listener(ch1)

    async def listener(self, channel):
        """
        Async REDIS listener function
        """
        while True:
            while await channel.wait_message():

                # wait for something to be published to the channel
                msg_json = await channel.get(encoding='utf-8')

                try:
                    # parse into Message object
                    msg = Message(msg_json)

                    # write the message to the client
                    self.on_message(msg)

                # catch any malformed messages send to this channel
                except Exception as e:
                    print(e)
