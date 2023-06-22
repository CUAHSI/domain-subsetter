#!/usr/bin/env python3


import os
import entry
from pathlib import Path


def usage() -> None:
    print("""
    Usage: argo-entry.py
    Description: Entrypoint for running Parflow subsetting in Argo.
    Parameters: The following parameters must exist as environment variables
                within the container. 
                PFINPUT: path to the static PF-CONUS input data
                SHAPE  : path the the shapefile that will be used to clip the data
                OUTPUT : path to save the output data
                LABEL  : (Optional) name that will be used to save subset data
    """)

if __name__ == '__main__':
    # read inputs from envars
    pfinput_dir   = os.environ.get('PFINPUT', None)
    shapefile_dir = os.environ.get('SHAPE', None)
    output_dir    = os.environ.get('OUTPUT', None)
    output_name   = os.environ.get('LABEL', 'subset')

    if None in (pfinput_dir, shapefile_dir, output_dir):
        # show usage
        usage()
    else:
        #print("Moving input files")
        #import shutil
        #print("Moving " + "conus1_inputs.tar.gz")
        #shutil.copy(os.path.join(pfinput_dir, "conus1_inputs.tar.gz"), "/input")
        #print("Done Moving input files")
        print("Being extracting")
        import tarfile
        conus_tar = tarfile.open(os.path.join(pfinput_dir, "conus1_inputs.tar.gz"))
        conus_tar.extractall("/input")
        print("Done extracting")
        file_names = os.listdir("/input")
        for file_name in file_names:
            print(file_name)
        # call the entry script
        entry.subset(output_name,
                     Path(shapefile_dir),
                     Path("/input"),
                     Path(output_dir))



