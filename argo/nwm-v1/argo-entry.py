#!/usr/bin/env python3


import os
import entry
from pathlib import Path


def usage() -> None:
    print("""
    Usage: argo-entry.py
    Description: Entrypoint for running NWM v1 subsetting in Argo.
    Parameters: The following parameters must exist as environment variables
                within the container. 
                XMIN: lower longitude of the subset region
                XMAX: upper longitude of the subset region
                YMIN: lower latitude of the subset region
                YMAX: upper latitude of the subset region
                NWMINPUT: path to the static NWM hydrofabric data
                OUTPUT : path to save the output data
    """)

if __name__ == '__main__':
    # read inputs from envars
    xmin         = os.environ.get('XMIN', None)
    xmax         = os.environ.get('XMAX', None)
    ymin         = os.environ.get('YMIN', None)
    ymax         = os.environ.get('YMAX', None)
    nwm_data_dir = os.environ.get('NWMINPUT', None)
    output_dir   = os.environ.get('OUTPUT', None)
    

    if None in (xmin, xmax, ymin, ymax, nwm_data_dir, output_dir):
        # show usage
        usage()
    else:
        # call the entry script
        entry.subset('uid-not-used',
                     ymin,
                     ymax,
                     xmin,
                     xmax,
                     Path(nwm_data_dir),
                     Path(output_dir))



