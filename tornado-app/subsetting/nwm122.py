#!/usr/bin/env python3

import os
import sys
import json
import redis
import subprocess
import transform
import tarfile
import shutil

import watershed
import environment as env


def subset_nwm_122(uid, ymin, xmin, ymax, xmax, hucs, logger=None):

    # connect to redis
    r = redis.Redis(env.redis_url, env.redis_port)
    
        
    # connect to the logger
    if logger is None:
        from tornado.log import app_log
        logger = app_log

    jobinfo = f'UID: {uid}, xmin: {xmin}, ymin :{ymin}, ' + \
              f'xmax : {xmax}, ymax : {ymax}'

    # list object to store stdout info for debugging
    stdout = []
    stdout.append(jobinfo)

    bbox = (float(xmin),
            float(ymin),
            float(xmax),
            float(ymax))

    # TODO: check bbox size

    # run R script and save output as random guid
    logger.info('begin NWM v1.2.2 subsetting %s' % (uid))
    logger.info(jobinfo)

    cmd = ['Rscript',
           'subset_domain.R',
           uid,
           str(ymin),
           str(ymax),
           str(xmin),
           str(xmax),
           env.wrfdata,
           env.output_dir]
    print(' '.join(cmd))
    p = subprocess.Popen(cmd,
                         cwd=os.path.join(os.getcwd(), 'r-subsetting'),
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT)

    for line in iter(p.stdout.readline, b''):
        l = line.decode('utf-8').rstrip()
        if l != '':
            # save stdout to logs and send to redis
            logger.debug(l)
            r.publish(uid, json.dumps({'type': 'message',
                                       'status': 'success',
                                       'channel': uid,
                                       'value': l}))

    p.stdout.close()
    return_code = p.wait()

    if not return_code == 0:
        msg = 'The process call "{}" returned with code {}, an error ' \
              'occurred.'.format(list(cmd), return_code)
        logger.error('subsetting failed %s: %s' % (uid, msg))
#        r.publish(uid, msg)
        response = dict(message=msg, status='error')

        return response

    logger.info('subsetting complete %s' % (uid))

    # run watershed shapefile creation
    if len(hucs) != 0:
        logger.debug('Submitting create_shapefile')
        outpath = os.path.join(env.output_dir, uid, 'watershed.shp')
        outfile = watershed.create_shapefile(uid, hucs, outpath)
    else:
        msg = 'skipping create_shapefile b/c no hucs were provided'
        logger.debug(msg)
#        r.publish(uid, msg)

#    # compress the results
#    fpath = os.path.join(env.output_dir, uid)
#    outname = '%s.tar.gz' % uid
    outpath = os.path.join(env.output_dir, uid)
#    with tarfile.open(outpath,  "w:gz") as tar:
#        tar.add(fpath, arcname=os.path.basename(fpath))
#    shutil.rmtree(fpath)
#    logger.info('finished compressing results %s' % (uid))

    response = dict(message='file created at: %s' % outpath,
                    filepath='/data/%s' % uid,
                    status='success')
    return response
