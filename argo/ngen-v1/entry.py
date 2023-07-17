#!/usr/bin/env python3

# import libraries
import os
import typer
import shutil
from pathlib import Path
import subset  # subset.py

# define functions
def main(
        name: str = typer.Argument(..., help="Name or ID of the most downstream catchment, e.g. wb-2917533"),
        vpu: str = typer.Argument(..., help="VPU (Vector Processing Unit based on NHDPlusV2) ID"),
        hydrofabric_url: str = typer.Argument("s3://nextgen-hydrofabric/pre-release/", help="URL of the hydrofabric data on S3 bucket"),
        output_dir: Path = typer.Argument("/srv/output", help="Directory to save output"),
        ):

    subset_data(name, vpu, hydrofabric_url, output_dir)


def subset_data(
          name: str,
          vpu: str,
          hydrofabric_url: str,
          output_dir: Path) -> None:

    """
    Subset the ngen hydrofabric for a given outlet catchment 

    Parameters:
    name: str
        Name or ID of the most downstream catchment
    vpu: str
        HUC2 value based on NHDPlusV2
    hydrofabric_url: str
        Path to hydrofabric data
    output_dir: str
        Path to save the output results
    """

    print("Ngen Hydrofabric Subsetting Started.", flush=True)
    print("Downstream catchment id is: ", name)

    # define path to the hydrofabric dataset on S3 bucket 
    s3_path = f'{hydrofabric_url}nextgen_{vpu}.gpkg'
    
    # subset all upstream catchments for the outlet catchement
    subset.subset_upstream(s3_path, name)

    # move results to the output folder
    for f in [f'{name}_upstream_subset.gpkg',
              'catchments.geojson',
              'crosswalk.json',
              'flowpath_edge_list.json',
              'flowpaths.geojson',
              'nexus.geojson',
              'cfe_noahowp_attributes.csv']:
        shutil.move(f, os.path.join(output_dir, f)) 


if __name__ == "__main__":
    typer.run(main)
