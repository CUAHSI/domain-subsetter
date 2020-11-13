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
    logger.info('Extracting watershed')
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
    logger.info(f'CMD: {cmd}')
    run_cmd(cmd)

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


def subset_old(uid, hucs, outdir, logger=None):
    """
    function that runs all subsetting functions for PFCONUS 1.0
    """

    logger = get_logger(logger, uid)

    # run watershed shapefile creation
    logger.info('Extracting watershed')
    outpath = os.path.join(outdir, 'watershed.shp')
    watershed_file = watershed.create_shapefile(uid, hucs, outpath)

    # read shapefile records
    ids = []
    with shapefile.Reader(watershed_file) as shp:
        for record in shp.records():
            ids.append(str(record[0]))

    # run the subsetting functions
    clip_inputs(watershed_file, ids, outdir, logger=logger)
    pfsol_file = subset_domain(watershed_file,
                               ids, outdir,
                               logger=logger)
    extract_clm(watershed_file, ids, outdir, logger=logger)
    create_tcl(pfsol_file, outdir, logger=logger)

    # write metadata file
    meta = {'date_processed': str(datetime.now(tz=timezone.utc)),
            'guid': uid,
            'model': 'Parflow CONUS',
            'version': '1.0',
            'hucs': hucs}

    with open(f'{os.path.dirname(outdir)}/{uid}/metadata.json', 'w') as jsonfile:
        json.dump(meta, jsonfile)

    # copying the run script for executing parflow in docker
    logger.info('Copying run script')
    shutil.copyfile(os.path.join(env.pfdata_v1, 'run.sh'),
                    f'{os.path.dirname(outdir)}/{uid}/run.sh')

    # copy the binder files
    logger.info('Copying binder files')
    shutil.copytree(os.path.join(env.pfdata_v1, 'binder'),
                    f'{os.path.dirname(outdir)}/{uid}/binder')

    # compress the outputs and clean temporary directory
    logger.info('Building and compressing outputs')
    fpath = os.path.join(env.output_dir, uid)
    outname = f'{uid}.tar.gz'
    outpath = f'{os.path.dirname(outdir)}/{outname}'
    with tarfile.open(outpath, "w:gz") as tar:
        tar.add(fpath, arcname=os.path.basename(fpath))
#    shutil.rmtree(fpath)

    return dict(message='PF-CONUS 1.0 subsetting complete',
                filepath=f'/data/{outdir}',
                status='success')


def clip_inputs(watershed_file, ids, outdir, logger=None):
    logger = get_logger(logger)

    logger.info(env.pfslopex)
    files_to_clip = [env.pfslopex,
                     env.pfslopey,
                     env.pfgrid,
                     env.pfpress]
    for fclip in files_to_clip:
        logger.info(f'Clipping inputs - {fclip}')
        name = os.path.basename(fclip)
        ofile = os.path.join(outdir, name)
        cmd = [sys.executable,
               'Clip_Inputs/clip_inputs.py',
               '-i', fclip,
               '-out_name', ofile,
               '-pfmask', env.pfmask,
               'shapefile',
               '-shp_file', watershed_file,
               '-att', 'ID',
               '-id']
        cmd.extend(ids)
        run_cmd(cmd)

    return dict(message='clip_inputs completed',
                filepath=f'/data/{outdir}',
                status='success')


def subset_domain(watershed_file, ids, outdir, logger=None):
    logger = get_logger(logger)

    logger.info('Subsetting Domain Files')
    pfsol_ofile = os.path.join(outdir, 'subset')
    cmd = [sys.executable,
           'Create_Subdomain/subset_domain.py',
           '-out_name', pfsol_ofile,
           '-pfmask', env.pfmask,
           '-pflakesmask', env.pflakesmask,
           '-pflakesborder', env.pflakesborder,
           '-pfbordertype', env.pfbordertype,
           '-pfsinks', env.pfsinks,
           'shapefile',
           '-shp_file', watershed_file,
           '-att', 'ID',
           '-id']
    cmd.extend(ids)
    run_cmd(cmd)

    return pfsol_ofile


def extract_clm(watershed_file, ids, outdir, logger=None):
    logger = get_logger(logger)

    logger.info('Extract CLM Lat/Lon')
    latlon_ofile = os.path.join(outdir, 'latlon.txt')
    cmd = [sys.executable,
           'CLM/domain_extract_latlon.py',
           '-shp_file', watershed_file,
           '-id']
    cmd.extend(ids)
    cmd.extend(['-att', 'ID',
                '-pfmask', env.pfmask,
                '-out_name', latlon_ofile])
    run_cmd(cmd)

    # Create vsgm LatLon
    logger.info('Extract vsgm Lat/Lon')
    ofile = os.path.join(outdir, 'drv_vegm.dat')
    cmd = [sys.executable,
           'CLM/create_vegm_latlon.py',
           '-input_igbp', env.gbpl,
           '-input_latlon', latlon_ofile,
           '-out_name', ofile]
    run_cmd(cmd)


def create_tcl(pfsol_file, outdir, logger=None):
    logger = get_logger(logger)

    logger.info('Creating TCL Script')
    cmd = [sys.executable,
           'Make_Tcl/generate_tcl.py',
           '--runname', 'cuahsi-subset',
           '-o', os.path.join(outdir, 'simulation.tcl'),
           '-i', env.pftemplate,
           '-sl', os.path.join(outdir),
           '-so', f'{pfsol_file}.pfsol',
           '-e', '50',
           '-ts', '0.5',
           '--baseu', '0.5',
           '--batches', '2', '3', '6',
           '-dz', '1000',
           '--dz_scales', '0.001', '0.5', '0.5', '0.5', '0.5',
           '--perm', '1.0e-6']
    run_cmd(cmd)


def run_cmd(cmd):
    logger = get_logger(None)
    environ = os.environ.copy()
    environ['PARFLOW_DIR'] = env.pfexedir
    p = subprocess.Popen(cmd,
                         #cwd=env.pfexedir,
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT,
                         env=environ)
#                         env=os.environ.copy())
    output = p.stdout.read().decode('utf-8')
    if output != '':
        print(output)
        logger.info(output)
