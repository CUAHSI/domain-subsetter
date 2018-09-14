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

        # starting workers
        for n in range(self.numprocesses):
            process = Process(target=self.worker)
            process.start()
            self.Processes.append(process)


    def add(self, uid, function, *args, **kwargs):
        item = dict(function = function,
                    args = args,
                    kwargs = kwargs,
                    state = 'queued',
                    uid = uid)
        self.queue.put(item)
        self.jobs[uid] = item

        self.sql.save_job(uid, item['state'], '')

        return uid       

    
    def worker(self):
        while True:
            # get queued item 
            item = self.queue.get()

            try:
                uid = item['uid']
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

            self.sql.save_job(uid,
                              item['state'],
                              item['result']['filepath'])
