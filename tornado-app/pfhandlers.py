#!/usr/bin/env python3

import os
import jobs
import shutil
import hashlib
import shapefile
import watershed
import tornado.web
import tornado.auth
import environment as env
from subsetting import parflow1
from tornado.log import app_log
from tornado.log import enable_pretty_logging

enable_pretty_logging()
executor = jobs.BackgroundWorker()


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

        global executor

        hucs = self.get_argument('hucs', True, strip=True).split(',')
        app_log.info(f'subsetting PF-CONUS 1.0: {hucs}')

        # calculate unique hash based on bbox
        hasher = hashlib.sha1()
        hasher.update(str(hucs).encode('utf-8'))
        uid = hasher.hexdigest()

        # make a directory for the output
        # TODO: return existing directory rather than recreate it!
        # check if this job has been executed previously
        # app_log.debug('Checking if job exists')
        # res = sql.get_job_by_guid(uid)
        # app_log.debug(res)
        outdir = os.path.join(env.output_dir, uid)
        if os.path.exists(outdir):
            shutil.rmtree(outdir)
        os.mkdir(outdir)

        # run watershed shapefile creation
        app_log.info('Extracting watershed')
        outpath = os.path.join(outdir, 'watershed.shp')
        watershed_outfile = watershed.create_shapefile(uid, hucs, outpath)
        app_log.info(watershed_outfile)

        # read shapefile records
        ids = []
        with shapefile.Reader(watershed_outfile) as shp:
            for record in shp.records():
                ids.append(str(record[0]))

        app_log.info(f'UID: {uid}')
        app_log.info(f'IDs: {ids}')
        app_log.info(f'SHAPEFILE: {watershed_outfile}')

        # Subset PF-CONUS 1.0
        app_log.info('Begin PF-CONUS 1.0 Subsetting')
        args = (uid, watershed_outfile, ids, outdir)
        uid = executor.add(uid, parflow1.subset, *args)

        # redirect to status page for this job
        app_log.debug('redirecting to status page')
        self.redirect('/status/%s' % uid)
