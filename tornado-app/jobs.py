#!/usr/bin/env python3


import uuid
import sqldata
from datetime import datetime
from multiprocessing import Process, Queue
from tornado.log import app_log, gen_log, access_log

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

        app_log.info('job queued: %s' % uid) 
        self.sql.save_job(uid, item['state'], '')

        return uid       

    
    def worker(self):
        while True:
            # get queued item 
            item = self.queue.get()
            
            app_log.info('begin job: %s' % item['uid']) 

            try:
                uid = item['uid']
                start = datetime.now()
                self.sql.save_job(uid,
                                  'running',
                                  '',
                                  start)

                # update the job state
                item['state'] = 'running'
                self.jobs[uid] = item
                
                # run the job
                res = item['function'](*item['args'],**item['kwargs'])
            
                app_log.info('completed job: %s' % item['uid']) 
                
                # save output and yield result
                item['dt_end'] = datetime.now()
                item['dt_start'] = start
                item['result'] = res
                item['state'] = 'finished'
                self.jobs[uid] = item
                
            except Exception as e:
                print('job failed: %s' % e)
                item['state'] = 'failed'
                item['result'] = dict(filepath='')
                self.jobs[uid] = item
                app_log.error('%s: %s' % (item['uid'], e))

            try:
                self.sql.save_job(uid,
                              item['state'],
                              item['result']['filepath'],
                              item['dt_start'],
                              item['dt_end'])
                app_log.info('saved job results to db: %s' % item['uid'])
            except:
                app_log.error('%s: could not find output file' % item['uid'])
                self.sql.save_job(uid,
                              item['state'],
                              '',
                              item['dt_start'],
                              item['dt_end'])







