#!/usr/bin/env python3

# import libraries
import os
import entry   # entry.py
from pathlib import Path

# define functions
def usage() -> None:
    print("""
    Usage: argo-entry.py
    Description: Entrypoint for running Ngen subsetting in Argo.
    Parameters: The following parameters must exist as environment variables
                within the container. 
                NAME: Name or ID of the most downstream catchment
                VPU: HUC2 ID
                HYDROFABRIC_URLl: path to the static hydrofabric input data
                OUTPUT: path to save the output data
    """)

if __name__ == '__main__':
    # read inputs from envars
    name = os.environ.get('NAME', None)
    vpu = os.environ.get('VPU', None)
    hydrofabric_url = os.environ.get('HYDROFABRIC_URL', None)
    output_dir = os.environ.get('OUTPUT', None)

    if None in (name, vpu):
        # show usage
        usage()
    else:
        # call the entry script
    entry.subset_data(name,
                     vpu,
                     hydrofabric_url,
                     Path(output_dir)
                     )



