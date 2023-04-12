#!/usr/bin/env python3

import sys
import uuid
import typer
import subprocess
from pathlib import Path


def main(
    ymin: float = typer.Argument(..., help="Lower y boundary"),
    xmin: float = typer.Argument(..., help="Lower x boundary"),
    ymax: float = typer.Argument(..., help="Upper y boundary"),
    xmax: float = typer.Argument(..., help="Upper x boundary"),
    nwmv1_data: str = typer.Argument(
        "/srv/domain",
        help="Directory where NWM V1.1 data is located/mounted " "within the container",
    ),
    output_dir: str = typer.Argument("/srv/output", help="Directory to save output"),
):

    # generate unique identifier for the job
    uid = uuid.uuid4().hex

    subset(uid, xmin, xmax, ymin, ymax, nwmv1_data, output_dir)


def subset(uid, xmin, xmax, ymin, ymax, nwmv1_data, output_dir="/tmp"):

    cmd = [
        "/usr/bin/Rscript",
        "subset_domain.R",
        uid,
        str(ymin),
        str(ymax),
        str(xmin),
        str(xmax),
        nwmv1_data,
        output_dir,
    ]
    print(" ".join(cmd))
    p = subprocess.Popen(
        cmd, cwd=Path("/srv/scripts"), stdout=subprocess.PIPE, stderr=subprocess.STDOUT
    )
    for c in iter(lambda: p.stdout.read(1), b""):
        sys.stdout.buffer.write(c)
    p.stdout.close()
    p.wait()


#    # run watershed shapefile creation
#    if len(hucs) != 0:
#        logger.debug('Submitting create_shapefile')
#        outpath = os.path.join(outdir, 'watershed.shp')
#        watershed.create_shapefile(uid, hucs, outpath)
#    else:
#        msg = 'skipping create_shapefile b/c no hucs were provided'
#        logger.debug(msg)
#
#    # write metadata file
#    meta = {'date_processed': str(datetime.now(tz=timezone.utc)),
#            'guid': uid,
#            'model': 'WRF-Hydro configured as NWM',
#            'version': '1.2.2',
#            'hucs': hucs}
#
#    with open(os.path.join(outdir, 'metadata.json'), 'w') as jsonfile:
#        json.dump(meta, jsonfile)

if __name__ == "__main__":
    typer.run(main)
