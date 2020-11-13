#!/usr/bin/env python3

import os
import sys
import json
import shutil
import tarfile
import logging
import shapefile
import watershed
import subprocess
import redislogger as rl
import environment as env
from datetime import datetime, timezone
from tornado.log import enable_pretty_logging

enable_pretty_logging()


def get_logger(logger, uid=None):
    if logger is None:
        from tornado.log import app_log
        logger = app_log

    # add redis handler
    if uid is not None:
        rh = rl.RedisHandler(uid)
        rh.setLevel(logging.INFO)
        logger.addHandler(rh)

    return logger

def subset(uid, hucs, outdir, logger=None):
    """
    function that runs all subsetting functions for PFCONUS 1.0
    """

    logger = get_logger(logger, uid)
    # run watershed shapefile creation
    logger.info('Building shapefile for selected region')
    watershed_outpath = os.path.join(outdir, 'watershed.shp')
    watershed_file = watershed.create_shapefile(uid, hucs, watershed_outpath)

    # read shapefile records
    ids = []
    with shapefile.Reader(watershed_file) as shp:
        for record in shp.records():
            ids.append(str(record[0]))

    # run the subsetting functions
    cmd = [sys.executable,
           '-m',
           'parflow.subset.tools.subset_conus',
           '-i', outdir,
           '-s', 'watershed',
           '-f', env.pfdata_v1,
           '-v', '1',
           '-w',
           '-n', 'subset_watershed',
           '-e', 'ID',
           '-a']
    cmd.extend(ids)
    run_cmd(uid, cmd)

    # write metadata file
    meta = {'date_processed': str(datetime.now(tz=timezone.utc)),
            'guid': uid,
            'model': 'Parflow CONUS',
            'version': '1.0',
            'hucs': hucs}

    with open(os.path.join(outdir, 'metadata.json'), 'w') as jsonfile:
        json.dump(meta, jsonfile)

    # copying the run script for executing parflow in docker
    logger.info('Copying run script')
    shutil.copyfile(os.path.join(env.pfdata_v1, 'run.sh'),
                    os.path.join(outdir, 'run.sh'))

    # copy the binder files
    logger.info('Copying binder files')
    shutil.copytree(os.path.join(env.pfdata_v1, 'binder'),
                    os.path.join(outdir, 'binder'))

#    # compress the outputs and clean temporary directory
#    logger.info('Building and compressing outputs')
#    fpath = os.path.join(env.output_dir, uid)
#    outname = f'{uid}.tar.gz'
#    outpath = f'{os.path.dirname(outdir)}/{outname}'
#    with tarfile.open(outpath, "w:gz") as tar:
#        tar.add(fpath, arcname=os.path.basename(fpath))
##    shutil.rmtree(fpath)

    return dict(message='PF-CONUS 1.0 subsetting complete',
                filepath=f'/data/{outdir}',
                status='success')


def run_cmd(uid, cmd):
    logger = get_logger(None, uid)
    logger.info(f'Running subsetting command: {" ".join(cmd)}')

    # collect the environment vars for the subprocess
    environ = os.environ.copy()
    environ['PARFLOW_DIR'] = env.pfexedir

    # run the job
    p = subprocess.Popen(cmd,
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT,
                         env=environ)

    # read stdout and log messages
    output = p.stdout.read().decode('utf-8')
    if output != '':
#        print(output)
        logger.info(output)
