#!/usr/bin/env python3


import toro
import tornado.gen
from tornado.concurrent import Future
import uuid

class BackgroundWorker(object):

    def __init__(self):
        self.queue = toro.Queue()
        self.jobs = {}


    @tornado.gen.coroutine
    def add(self, function,async,*args,**kwargs):
        print('queuing job')
        uid = uuid.uuid4().hex
        item = dict(function = function,
                    async = async,
                    args = args,
                    kwargs = kwargs,
                    state = 'queued',
                    uid = uid)
        self.queue.put(item)
        print(self.queue.qsize())
        self.jobs[uid] = item

        return uid       
#        raise tornado.gen.Return(uid)

    @tornado.gen.coroutine
    def poll(self, uid):
        item = self.jobs.get(uid, None)
        if item is None:
            result = dict(state='Does not exist')
            raise tornado.gen.Return(result)
        if item['state'] == 'finished':
            # pop this item from the jobs dict
            item = self.jobs.pop(uid, None)
            result = dict(result=item['result'],
                          state=item['state'])
#            raise tornado.gen.Return(result)
            return result
        else:
#            raise tornado.gen.Return(dict(state=item['state']))
            return dict(state=item['state'])
    
    
    @tornado.gen.coroutine
    def worker(self):
        print('--> %d' % self.queue.qsize())
        while True:
            # get queued item 
            print('waiting for items')
            item = yield self.queue.get()
            print('--> %d' % self.queue.qsize())
            try:
                print('running job')

                # update the job state
                uid = item['uid']
                item['state'] = 'running'
                self.jobs[uid] = item
                
                # run the job
                res = item['function'](*item['args'],**item['kwargs'])
                
                # save output and yield result
                item['result'] = res
                item['state'] = 'finished'
                self.jobs[uid] = item
                
#                print('done')
#                yield uid

            except Exception as e:
                print('job failed: %s' % e)
                item['state'] = 'failed'
                item['result'] = None
                self.jobs[uid] = item
    
    @tornado.gen.coroutine
    def start(self):
        yield self.worker()
