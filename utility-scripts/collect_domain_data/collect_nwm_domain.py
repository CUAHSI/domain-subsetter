#!/usr/bin/env python3


import os
import sys
import wget
import requests
from lxml import html

nwm_version = "2.0.5"
outdir = "."
base_url = "https://www.nco.ncep.noaa.gov/pmb/codes/nwprod/"
# nwm.v'

# 2.0.5/parm/domain/

# get the name of nwm folder on ncep
res = requests.get(base_url)
tree = html.fromstring(res.content)

# get the NWM html element
nwm_element = tree.xpath('.//a[contains(text(), "nwm")]')

# check if folder name exists in output directory
if len(nwm_element) == 0:
    print("Could not find NWM directory, exiting")
    sys.exit(1)

nwm_version = nwm_element[0].text
nwm_url = nwm_element[0].attrib["href"]
print(f".. found NWM directory: {nwm_version}")

outdir = os.path.join(outdir, nwm_version)

if os.path.exists(outdir):
    print(".. data already exists, skipping")
    sys.exit(0)

# make a directory for the data we'll be downloading
os.makedirs(outdir)

# generate list of files to download
res = requests.get(f"{base_url}{nwm_url}/parm")
tree = html.fromstring(res.content)
file_dict = {}
for domain in tree.xpath('.//a[contains(text(), "domain")]'):
    name = domain.text
    domain_url = domain.attrib["href"]

    res = requests.get(f"{base_url}{nwm_url}parm/{domain_url}")
    domain_tree = html.fromstring(res.content)
    file_links = domain_tree.xpath('.//td/a[not(contains(text(), "Parent"))]')
    file_dict[name] = [
        f'{base_url}{nwm_url}parm/{domain_url}{f.attrib["href"]}' for f in file_links
    ]

for k, files in file_dict.items():
    outpath = os.path.join(outdir, k)
    os.makedirs(outpath)

    # download each file
    for f in files:
        wget.download(f, out=os.path.join(outpath, os.path.basename(f)))
