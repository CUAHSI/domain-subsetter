#!/usr/bin/env python3

import os
import json
import subprocess
import transform


def subset_by_bbox(uid, llat, llon, ulat, ulon):

    geofile = '/home/acastronova/www.nco.ncep.noaa.gov/pmb/codes/nwprod/nwm.v1.2.2/parm/domain/geo_em.d01_1km.nc'
    bbox = (float(llon),
            float(llat),
            float(ulon),
            float(ulat))
    coords = [(bbox[0], bbox[1]), # lower left
              (bbox[2], bbox[3]), # upper left
              (bbox[2], bbox[3]), # upper right
              (bbox[0], bbox[1])] # lower right
    transformed = transform.proj_to_coord(coords)
    xs = [t[0] for t in transformed]
    ys = [t[1] for t in transformed]
    ysouth= min(ys)
    ynorth= max(ys)
    xwest = min(xs)
    xeast=  max(xs)

    # check that bbox is valid
    print('validating bounding box')
    if (ysouth > ynorth) | (xwest > xeast):
        print('invalid bounding box')

    # run R script and save output as random guid
    print('invoking subsetting algorithm')

    cmd = ['Rscript',
           'subset_domain.R',
           uid,
           str(ysouth),
           str(ynorth),
           str(xwest),
           str(xeast)]
    print(' '.join(cmd))
    p = subprocess.Popen(cmd,
                         cwd=os.path.join(os.getcwd(),'r-subsetting'),
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT)

    for line in iter(p.stdout.readline, b''):
        print(">>> " + line.decode('utf-8').rstrip())
    p.stdout.close()
    return_code = p.wait()

    if not return_code == 0:
        response = dict(message =
            'The process call "{}" returned with code {}, an error '
            'occurred.'.format(list(cmd), return_code),
                       status='error')
    else:
        fpath = os.path.join('/tmp', uid) 
        outname = '%s.tar.gz' % uid
        cmd = ['tar', '-czf', outname, fpath] 
        p = subprocess.Popen(cmd, cwd = '/tmp',
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT)
        for line in iter(p.stdout.readline, b''):
            print("$ " + line.decode('utf-8').rstrip())
        p.stdout.close()
        return_code = p.wait()

        response = dict(message='file created at: /tmp/%s' % outname,
                        filepath='/data/%s' % outname,
                        status='success')

    return response
