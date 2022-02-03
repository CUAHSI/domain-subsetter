#!/usr/bin/env python

import json
import asyncio
import aioredis
import tornado.web
import tornado.websocket
from datetime import datetime
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


class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Messages(object, metaclass=Singleton):
    def __init__(self):
        self.messages = {}
        self.last_message = {}
        self.active_listeners = {}
    def add_channel(self, channel):
        app_log.info(f'adding channel {channel}')

        # create and entry in message_list to hold all messages for the
        # given channel
        if channel not in self.messages.keys():
            self.messages[channel] = []
            self.last_message[channel] = datetime.now()
            self.active_listeners[channel] = 1
        else:
            self.active_listeners[channel] += 1
        
        app_log.info(f'{channel}: {self.active_listeners[channel]} listeners')

    def add_message(self, channel, msg_obj):
        now = datetime.now()
        # exit early if we just received a message on this channel within 
        # 10 milliseconds. This is to prevent adding the same message for multiple
        # subscribing sockets.
        if (now - self.last_message[channel]).total_seconds() * 1000 <= 10:
            return
        
        app_log.info('adding message')

        # save the message in message_list so data
        # will persist between html pages
        self.messages[channel].append(msg_obj)
        self.last_message[channel] = now

    def get_messages(self, channel):
        # return all message for the given channel
        return self.messages[channel]

    def del_channel(self, channel):

        self.active_listeners[channel] -= 1
        app_log.info(f'removing listener for channel: {channel}')
        app_log.info(f'{channel}: {self.active_listeners[channel]} listeners')
        if self.active_listeners[channel] == 0:
            app_log.info(f'deleting messages for channel: {channel}')
            self.messages.pop(channel, None)


class SocketHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.messages = Messages()

    async def open(self, uid):

        # use the UID sent from the client to filter REDIS messages
        self.channel = uid
        
        # add channel to messages class
        self.messages.add_channel(self.channel)

        # instantiate pubsub listener in the background
        IOLoop.current().spawn_callback(self.pubsub)
        await asyncio.sleep(0.1)

        app_log.info(f'new connection listening on channel: {self.channel}')
        app_log.info('WebSocket Opened')
    
    async def delay_close(self):
        await asyncio.sleep(2)

        app_log.info(f'WebSocket Closed: {self.channel}')

        # remove all message for this channel in message_list
        self.messages.del_channel(self.channel)
        
    def on_close(self):

        IOLoop.current().add_callback(
                self.delay_close
                )

#        # remove all message for this channel in message_list
#        self.messages.del_channel(self.channel)
        

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
            # print any messages that have been previously stored in the 
            # message_list dictionary
            channel_id = channel.name.decode()
            for msg in self.messages.get_messages(channel_id):
                self.on_message(msg)

            # wait for new messages
            while await channel.wait_message():

                # wait for something to be published to the channel
                msg_json = await channel.get(encoding='utf-8')

                try:
                    # parse into Message object
                    msg = Message(msg_json)
                    
                    # save the message in message_list so data 
                    # will persist between html pages
                    self.messages.add_message(channel_id, msg)

                    # write the message to the client
                    self.on_message(msg)

                # catch any malformed messages send to this channel
                except Exception as e:
                    print(e)
