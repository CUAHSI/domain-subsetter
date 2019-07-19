#!/usr/bin/env python3

# install dependencies:
# conda install -y xarray dask matplotlib netcdf4 scipy requests
# pip install tabulate

import os
import sys
import glob
import numpy
import xarray
import argparse
import requests
import matplotlib
from tabulate import tabulate
from datetime import datetime
import xml.etree.ElementTree as ET

matplotlib.use("TkAgg")
from matplotlib import pyplot as plt
import matplotlib.dates as mdates


def lookup_comid(df, gid, verbose=True):
    dat = df[df.gages == gid]
    data = dat.link.values
    if len(data) > 0:
        return data[0]
    else:
        print('--> !! could not find gage = %s' % gid)
        return None


def lookup_data(ds, fid, variable='streamflow'):

    print('--> processing data for gage %s... ' % fid, flush=True, end='')
    dat = ds.sel(feature_id=int(fid)).sortby('time', ascending=True)
    values = dat[variable].values
    times = dat.time.values
    print('done')

    return dict(gid=fid,
                variable=variable,
                values=values,
                times=times)


def collect_nwm_data(url, archive, config, geom, variable, comid, st, et):
    print('--> collecting NWM data for gage %s... ' % comid, flush=True, end='')

    query = '%s/?archive=%s&config=%s&geom=%s&variable=%s&COMID=%s&startDate=%s&endDate=%s' % (url, archive, config, geom, variable, comid, st, et)

    res = requests.get(query)
    root = ET.fromstring(res.text)

    ns = 'http://www.cuahsi.org/waterML/1.1/'
    vals = root.findall('{%s}timeSeries//{%s}value' % (ns, ns))
    times = []
    values = []
    
    for v in vals:
        values.append(float(v.text))
        dt_str = v.attrib['dateTime']
        times.append(datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%S"))
    print('done')

    return dict(gid=comid,
                variable='nwm_%s_cfs' % variable,
                values=values,
                times=times)


def plot(datasets):

    fig, ax = plt.subplots()
    n = len(datasets)
    colors = matplotlib.cm.jet(numpy.linspace(0, 1, n))
    i = 0
    for d in datasets:
        ax.plot_date(d['times'],
                     d['values'],
                     label='%s:%s' % (d['gid'], d['variable']),
                     linestyle='-', marker='', color=colors[i])
        i += 1
    ax.set(xlabel='date')
    ax.grid()
    ax.legend(loc='best')

    # format the ticks
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%m/%d/%Y'))
    fig.autofmt_xdate()

    plt.show()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='WrfHydro reach plotting utility')
    parser.add_argument('--route', help='route link file', required=True)
    parser.add_argument('--outdir', help='output directory', required=False)
    parser.add_argument('--list-gages', help='list all known gages in domain',
                        required=False, action='store_true')
    parser.add_argument('--list-reaches', help='list all reaches ids domain',
                        required=False, action='store_true')
    parser.add_argument('--plot', help='generate plot',
                        required=False, action='store_true')
    parser.add_argument('-gids', type=str, nargs='*',
                        help='USGS gage ids to plot', default=[])
    parser.add_argument('-rids', type=str, nargs='*',
                        help='WrfHydro reach gage ids to plot', default=[])
    parser.add_argument('-nwm', type=str, nargs='*', 
                        help='NWM reach ids to plot (collected from HS App)',
                        default=[])

    args = parser.parse_args()

    ds = xarray.open_dataset(args.route)
    df = ds.to_dataframe()
    df.gages = df.gages.str.decode('utf-8').str.strip()

    if args.list_gages:
        gages = [g for g in df.gages.values if g != '']
        if len(gages) > 0:
            print('--> the following gages were found in the domain')
            for g in gages:
                print('    ' + g)
        sys.exit(1)

    if args.list_reaches:

        cols = ['order', 'link']
        data = df[cols].sort_values(by=['order'])
        print(tabulate(data, cols, tablefmt='psql', floatfmt='12.0f'))
        sys.exit(1)

    if len(args.rids) > 0 or len(args.gids) > 0 or len(args.nwm) > 0:
        files = glob.glob(os.path.join(args.outdir, '*CHRTOUT*'))
        print('--> loading simulation output data... ', flush=True, end='')
        ds = xarray.open_mfdataset(files)
        print('done')

    plot_data = []
    for rid in args.rids:
        data = lookup_data(ds, rid)
        plot_data.append(data)

    for g in args.gids:
        gid = lookup_comid(df, g.strip())
        if gid is not None:
            data = lookup_data(ds, gid)
            plot_data.append(data)

    for n in args.nwm:
        # get start and end times from simulation output 
        st_ts = ds.time.min().values.astype(datetime)/1000000000
        st = datetime.utcfromtimestamp(st_ts)
        et_ts = ds.time.max().values.astype(datetime)/1000000000
        et = datetime.utcfromtimestamp(et_ts)

        data = collect_nwm_data('https://hs-apps-dev.hydroshare.org/apps/nwm-forecasts/api/GetWaterML',
                                'rolling', 'analysis_assim',
                                'channel_rt', 'streamflow', n,
                                st.strftime('%Y-%m-%d'),
                                et.strftime('%Y-%m-%d'))
        plot_data.append(data)

    if len(plot_data) > 0:
        # write output data
        for d in plot_data:
            with open('%s-%s.csv' % (d['gid'], d['variable']), 'w') as f:
                for i in range(0, len(d['values'])):
                    f.write('%s, %3.2f\n' % (d['times'][i], d['values'][i]))
    
        if args.plot:
            plot(plot_data)
