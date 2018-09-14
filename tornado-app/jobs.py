#!/usr/bin/env python3


import uuid
import sqldata
from multiprocessing import Process, Queue

class BackgroundWorker(object):

    def __init__(self):
        self.numprocesses = 4

        self.queue = Queue()
        self.jobs = {}

        self.sql = sqldata.Connect()
        self.sql.build()

        self.Processes = []

        print('starting %d workers' % self.numprocesses)
        for n in range(self.numprocesses):
            process = Process(target=self.worker)
            process.start()
            self.Processes.append(process)
        print('worker startup complete')


    def add(self, uid, function, *args, **kwargs):
        item = dict(function = function,
                    args = args,
                    kwargs = kwargs,
                    state = 'queued',
                    uid = uid)
        self.queue.put(item)
        self.jobs[uid] = item
        print('adding to queue:')

        self.sql.save_job(uid, item['state'], '')

        return uid       

    
    def worker(self):
        while True:
            print('waiting for jobs')
            # get queued item 
            item = self.queue.get()
            print('received job: %s ' % item['uid'])

            try:
                uid = item['uid']
                print('running job: %s' % uid)
                self.sql.save_job(uid, 'running', '')

                # update the job state
                item['state'] = 'running'
                self.jobs[uid] = item
                
                # run the job
                res = item['function'](*item['args'],**item['kwargs'])
                
                # save output and yield result
                item['result'] = res
                item['state'] = 'finished'
                self.jobs[uid] = item
                
            except Exception as e:
                print('job failed: %s' % e)
                item['state'] = 'failed'
                item['result'] = None
                self.jobs[uid] = item
            print('updating state of %s' %uid)
            self.sql.save_job(uid,
                              item['state'],
                              item['result']['filepath'])
    
#    @tornado.gen.coroutine
#    def start(self):
#        yield self.worker()
