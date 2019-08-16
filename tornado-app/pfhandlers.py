#!/usr/bin/env python3

import os
import sys
import tornado.auth
import tornado.web
import hashlib
import environment as env
import tarfile
import shutil
import subprocess
import shapefile

#import multiprocessing

import watershed
#from tornado import gen
#from tornado.httpclient import AsyncHTTPClient

from tornado.log import app_log
from tornado.log import enable_pretty_logging
enable_pretty_logging()


#import jobs
#executor = jobs.BackgroundWorker()
#
#import sqldata
#sql = sqldata.Connect(env.sqldb)
#sql.build()


class Index(tornado.web.RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):
        self.render("pfindex.html", title="PF-CONUS v1.0")

    def post(self):
        hucs = self.get_argument('hucs', True)

        # build GET url for subsetting
        query = f'hucs={hucs}'
        self.redirect('/parflow/v1_0/subset?%s' % query)


class SubsetParflow1(tornado.web.RequestHandler):
    """
    Subsetting endpoint for ParFlow CONUS 1.0
    """

    @tornado.gen.coroutine
    def get(self):

#        global executor

        hucs = self.get_argument('hucs', True, strip=True).split(',')
        app_log.info(f'subsetting PF-CONUS 1.0: {hucs}')

        # calculate unique hash based on bbox
        hasher = hashlib.sha1()
        hasher.update(str(hucs).encode('utf-8'))
        uid = hasher.hexdigest()

        # make a directory for the output
        outdir = os.path.join(env.output_dir, uid)
        os.mkdir(outdir)

        # run watershed shapefile creation
        app_log.info('Extracting watershed')
        outpath = os.path.join(outdir, 'watershed.shp')
        watershed_outfile = watershed.create_shapefile(uid, hucs, outpath)

        # read shapefile records
        ids = []
        with shapefile.Reader(watershed_outfile) as shp:
            for record in shp.records():
                ids.append(str(record[0]))

        # Clip Inputs
        files_to_clip = [env.pfslopex,
                         env.pfslopey,
                         env.pfgrid,
                         env.pfpress]
        for fclip in files_to_clip:
            name = os.path.basename(fclip)
            ofile = os.path.join(outdir, name)
            cmd = [sys.executable,
                   'Clip_Inputs/clip_inputs.py',
                   '-i', fclip,
                   '-out_name', ofile,
                   '-pfmask', env.pfmask,
                   'shapefile',
                   '-shp_file', watershed_outfile,
                   '-att', 'ID',
                   '-id']
            cmd.extend(ids)
            run_cmd(cmd)

        # Subset Domain
        ofile = os.path.join(outdir, 'subset')
        cmd = [sys.executable,
               'Create_Subdomain/subset_domain.py',
               '-out_name', ofile,
               '-pfmask', env.pfmask,
               '-pflakesmask', env.pflakesmask,
               '-pflakesborder', env.pflakesborder,
               '-pfbordertype', env.pfbordertype,
               '-pfsinks', env.pfsinks,
               'shapefile',
               '-shp_file', watershed_outfile,
               '-att', 'ID',
               '-id']
        cmd.extend(ids)
        run_cmd(cmd)

        # Extract CLM LatLon
        ofile = os.path.join(outdir, 'latlon.txt')
        cmd = [sys.executable,
               'CLM/domain_extract_latlon.py',
               '-shp_file', watershed_outfile,
               '-id']
        cmd.extend(ids)
        cmd.extend(['-att', 'ID',
                    '-pfmask', env.pfmask,
                    '-out_name', ofile])
        run_cmd(cmd)


       
#        # check if this job has been executed previously
#        app_log.debug('Checking if job exists')
#        res = sql.get_job_by_guid(uid)
#        app_log.debug(res)
#
#        # submit the job
#        if len(res) == 0:
#
#            # submit the subsetting job
#            args = (uid, llat, llon, ulat, ulon, hucs)
#            uid = executor.add(uid, subset.subset_nwm_122, *args)
#
#        # redirect to status page for this job
#        app_log.debug('redirecting to status page')
#        self.redirect('/status/%s' % uid)

        # todo: move this into a shared module
        # compress the results
        fpath = os.path.join(env.output_dir, uid)
        outname = f'{uid}.tar.gz'
        outpath = f'{env.output_dir}/{outname}'
        with tarfile.open(outpath,  "w:gz") as tar:
            tar.add(fpath, arcname=os.path.basename(fpath))
        shutil.rmtree(fpath)

        # temporary, remove
        self.redirect('/results/%s' % uid)


def run_cmd(cmd):
    p = subprocess.Popen(cmd,
                         cwd=os.path.join(os.getcwd(),
                                          'pfconus1/Subsetting'),
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT,
                         env=os.environ.copy())
    output = p.stdout.read().decode('utf-8')
    if output != '':
        app_log.info(output)
