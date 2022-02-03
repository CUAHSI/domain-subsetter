#!/usr/bin/env python3

import os
import json
import redis
import subprocess
from datetime import datetime, timezone

import watershed
import environment as env


def subset_nwm_200(uid, ymin, xmin, ymax, xmax, hucs, logger=None):

    # connect to redis
    r = redis.Redis(env.redis_url, env.redis_port)

    # define the output directory where subset files will be saved
    outdir = os.path.join(env.output_dir, uid)

    if logger is None:
        from tornado.log import app_log
        logger = app_log

    jobinfo = f'UID: {uid}, xmin: {xmin}, ymin :{ymin}, ' + \
              f'xmax : {xmax}, ymax : {ymax}'

    # list object to store stdout info for debugging
    stdout = []
    stdout.append(jobinfo)

#    # TODO: check bbox size
#    bbox = (float(xmin),
#            float(ymin),
#            float(xmax),
#            float(ymax))

    # run R script and save output as random guid
    logger.info('begin NWM v2.0.0 subsetting %s' % (uid))
    logger.info(jobinfo)

    cmd = ['Rscript',
           'subset_domain.R',
           uid,
           str(ymin),
           str(ymax),
           str(xmin),
           str(xmax),
           env.wrf2data,
           env.output_dir]
    print(' '.join(cmd))
    p = subprocess.Popen(cmd,
                         cwd=os.path.join(os.getcwd(),
                                          'subsetting/nwm200/subset_w_coordinates'),
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT)

    for line in iter(p.stdout.readline, b''):
        l = line.decode('utf-8').rstrip()
        if l != '':
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
        response = dict(message=msg, status='error')

        return response

    logger.info('subsetting complete %s' % (uid))

    # run watershed shapefile creation
    if len(hucs) != 0:
        logger.debug('Submitting create_shapefile')
        outpath = os.path.join(env.output_dir, uid, 'watershed.shp')
        watershed.create_shapefile(uid, hucs, outpath)
    else:
        msg = 'skipping create_shapefile b/c no hucs were provided'
        logger.debug(msg)

    # write metadata file
    meta = {'date_processed': str(datetime.now(tz=timezone.utc)),
            'guid': uid,
            'model': 'WRF-Hydro configured as NWM',
            'version': '2.0',
            'hucs': hucs}

    with open(os.path.join(outdir, 'metadata.json'), 'w') as jsonfile:
        json.dump(meta, jsonfile)

    response = dict(message=f'file created at: {outdir}',
                    filepath=f'/data/{uid}',
                    status='success')
    return response
