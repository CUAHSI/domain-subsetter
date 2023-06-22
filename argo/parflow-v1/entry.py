#!/usr/bin/env python3


import os
import sys
import typer
import subprocess
from pathlib import Path
import shapefile


def main(
    label: str = typer.Argument(
        "output", help="Name or ID of subset output, e.g. GUID or watershed name"
    ),
    shape_boundary: Path = typer.Argument(
        ..., help="Path to the shape boundary as an ESRI Shapefile"
    ),
    pfconus_data: Path = typer.Argument(
        "/srv/domain",
        help="Directory where PFConus data is located/mounted within the container",
    ),
    output_dir: Path = typer.Argument("/srv/output", help="Directory to save output"),
):

    subset(label, shape_boundary, pfconus_data, output_dir)


def subset(name: str,
           shape_boundary: Path,
           pfconus_data: Path,
           output_dir: Path) -> None:
    """
    Subset the parflow hydrofabric for a given shape boundary

    Parameters
    ----------
    name: str
        Name or label to give the output subset data
    shape_boundary: Path
        Path to the shapefile that represents the area to be subset
    pfconus_data: Path
        Path to the Parflow hydrofabric data
    output_dir: Path
        Path to save the output results


    Returns
    -------
    None

    """

    # read shapefile records
    ids = []
    with shapefile.Reader(shape_boundary) as shp:
        for record in shp.records():
            ids.append(str(record[0]))

    # run the subsetting functions
    shapefile_name_without_ext = ''.join(shape_boundary.name.split('.')[:-1])
    tmp_output = Path('/tmp')
    cmd = [
        sys.executable,
        "-m",
        "pfsubset.subset.tools.subset_conus",
        "-i",
        str(shape_boundary.parent),
        "-s",
        shapefile_name_without_ext,
        "--conus_files",
        str(pfconus_data),
        "-o",
        #str(output_dir),
        "/output",
        "-v",
        "1",  # subset version
#        "-w",  # write json, yaml, pfidb files
        "-n",
        name,  # name for the output files
        "-e",
        "ID",  # shapefile attribute column name
        "-a",
    ]  
    # shapefile attribute ids
    cmd.extend(ids)
    print(cmd)
    # collect the environment vars for the subprocess
    environ = os.environ.copy()
    environ["PARFLOW_DIR"] = "/usr/local"

    print(" ".join(cmd))

    # run the job
    proc = subprocess.Popen(
        cmd,
        cwd=output_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env=environ,
    )
    
    # read stdout and log messages
    #for line in iter(proc.stdout.readline, b""):
    #    sys.stdout.buffer.write(line)
    #proc.stdout.close()
    proc.wait()

    print('Subsetting Operation Complete')

    print("Moving output files")
    import shutil
    file_names = os.listdir("/output")
    for file_name in file_names:
        shutil.move(os.path.join("/output", file_name), output_dir)

#    # write metadata file
#    meta = {'date_processed': str(datetime.now(tz=timezone.utc)),
#            'guid': uid,
#            'model': 'Parflow CONUS',
#            'version': '1.0',
#            'hucs': hucs}
#
#    with open(os.path.join(outdir, 'metadata.json'), 'w') as jsonfile:
#        json.dump(meta, jsonfile)
#
#    # copying the run script for executing parflow in docker
#    logger.info('Adding Docker execution script')
#    shutil.copyfile(os.path.join(env.pfdata_v1, 'run.sh'),
#                    os.path.join(outdir, 'run.sh'))
#
#    # copy the binder files
#    logger.info('Adding binder definitions')
#    shutil.copytree(os.path.join(env.pfdata_v1, 'binder'),
#                    os.path.join(outdir, 'binder'))

if __name__ == "__main__":
    typer.run(main)
