#!/usr/bin/env python3

import uuid
import sqldata
import  multiprocessing as mp
from datetime import datetime
from tornado.log import app_log
from multiprocessing_logging import install_mp_handler


class BackgroundWorker(object):

    def __init__(self):
        self.numprocesses = 4

        self.queue = mp.Queue()
        self.jobs = {}

        self.sql = sqldata.Connect()
        self.sql.build()

        self.Processes = []

        # initialize the multiprocessing logger
        install_mp_handler(logger=app_log)

        # starting workers
        for n in range(self.numprocesses):
            process = mp.Process(target=self.worker, args=(app_log,))
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

    
    def worker(self, logger):
        while True:
            logger.info('ready and waiting for job') 

            # get queued item 
            item = self.queue.get()
            
            try:
                uid = item['uid']
                
                # save the start time for reporting
                start = datetime.now()
                item['dt_start'] = start

                self.sql.save_job(uid,
                                  'running',
                                  '',
                                  start)

                # update the job state
                item['state'] = 'running'
                self.jobs[uid] = item
                
                # run the job
                res = item['function'](*item['args'],**item['kwargs'],
                                       logger=logger)
            
                logger.info('job completed %s' % (item['uid']))
                
                # save output and yield result
                item['dt_end'] = datetime.now()
                item['result'] = res
                item['state'] = 'finished'
                self.jobs[uid] = item
                
                
            except Exception as e:
                logger.error('job failed %s: %s' % (item['uid'], e))
                item['state'] = 'failed'
                item['result'] = dict(filepath='')
                item['dt_end'] = datetime.now()
                self.jobs[uid] = item
                

            try:
                logger.info(item)
                self.sql.save_job(uid,
                              item['state'],
                              item['result']['filepath'],
                              item['dt_start'],
                              item['dt_end'])
                logger.info('results saved to db %s' % (item['uid']))
            except:
                logger.error('could not find output file %s' % 
                             (item['uid']))
                self.sql.save_job(uid,
                              item['state'],
                              '',
                              item['dt_start'],
                              item['dt_end'])
