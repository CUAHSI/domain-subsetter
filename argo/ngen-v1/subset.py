#!/usr/bin/env python3
"""subset.py
Module for subsetting hyfeatures based ngen hydrofabric geopackages. 
Adapted from hydrofabric subsetting code written by Nels Frazier <nfrazier@lynker.com>

@author Nels Frazier, Tony Castronova
@email nfrazier@lynker.com, acastronova@cuahsi.org
"""

import json
import s3fs
import fiona
import fsspec
import logging
import argparse
import pandas as pd
import networkx as nx
import geopandas as gpd
from pathlib import Path
import pyarrow.parquet as pq
from typing import List, Tuple


class LoadGDB:
    """Helper class for loading geodatabases.
    Performs a crude check to see if the geodatabase is stored locally
    or if it exists on Amazon S3.

    Attributes
    ----------
    isS3 : bool
        flag to indicate if the file is located on Amazon S3
    path : str
        path the the geodatabase file

    Methods
    -------
    read_gdb_layer(layer)
        reads the specified layer within the geodatabase
    list_gdb_layers()
        lists all layers within the geodatabase
    

    """

    def __init__(self, path: str) -> None:

        self.isS3 = False
        self.path = path
        if self.path[0:3] == "s3:":
            self.isS3 = True
            self.s3 = fsspec.filesystem("s3", anon=True)

    def read_gdb_layer(self, layer: str) -> gpd.GeoDataFrame:
        """
        Reads a single layer from the geodatabase

        Parameters
        ----------
        layer : str
            a string representation of the layer to load

        Returns
        -------
        geopandas.GeoDataFrame 
            A GeoDataFrame of the layer

        """
    
        if self.isS3:
            return self._get_layer_from_s3(layer)
        return gpd.read_file(self.path, layer=layer)

    def list_gdb_layers(self) -> List[str]:
        """
        Lists all layers that exist in the geodatabase

        Returns
        -------
        List[str]
            A list of all the layer names that exist in the geodatabase
        """

        if self.isS3:
            return self._list_layers_from_s3()
        return fiona.listlayers(self.path)

    def __s3_open(self) -> s3fs.core.S3File:
        return self.s3.open(self.path)

    def _list_layers_from_s3(self) -> List[str]:
        return fiona.listlayers(self.__s3_open())

    def _get_layer_from_s3(self, layer) -> gpd.GeoDataFrame:
        return gpd.read_file(self.__s3_open(), layer=layer)


def make_x_walk(hydrofabric: str) -> None:
    """Create crosswalk file from hydrofabric flowpath_attributes.
    Borrowed from https://github.com/NOAA-OWP/ngen/pull/464
    
    Parameters
    ----------
    hydrofabric : str
        Path to the hydrofabric geodatabase
    """

    attributes = gpd.read_file(hydrofabric, layer="flowpath_attributes").set_index("id")
    x_walk = pd.Series(attributes[~attributes["rl_gages"].isna()]["rl_gages"])

    data = {}
    for wb, gage in x_walk.items():
        data[wb] = {"Gage_no": [gage]}

    with open("crosswalk.json", "w") as fp:
        json.dump(data, fp, indent=2)


def make_geojson(hydrofabric: str) -> None:
    """Create the various required geojson/json files from the geopkg
    Borrowed from https://github.com/NOAA-OWP/ngen/pull/464
    
    Parameters
    ----------
    hydrofabric : str
        path to hydrofabric geopkg
    """

    try:
        loader = LoadGDB(hydrofabric)
        catchments = loader.read_gdb_layer(layer="divides")
        nexuses = loader.read_gdb_layer(layer="nexus")
        flowpaths = loader.read_gdb_layer(layer="flowpaths")
        edge_list = pd.DataFrame(
            loader.read_gdb_layer(layer="flowpath_edge_list").drop(columns="geometry")
        )
        make_x_walk(hydrofabric)
        catchments.to_file("catchments.geojson")
        nexuses.to_file("nexus.geojson")
        flowpaths.to_file("flowpaths.geojson")
        edge_list.to_json("flowpath_edge_list.json", orient="records", indent=2)
    except Exception as e:
        print(f"Unable to use hydrofabric file {hydrofabric}")
        print(str(e))
        raise e


def get_upstream_ids(
    nexus: gpd.GeoDataFrame, flow: gpd.GeoDataFrame, catchment_id: str
) -> Tuple[List, List]:
    """
    Collects all wb- and nex- ids upstream from the given catchment id.

    Parameters
    ----------
    nexus: GeoDataFrame
        Hydrofabric nexus (layer=nexus) dataframe
    flow: GeoDataFrame
        Hydrofabric flowpaths (layer=flowpaths) data frame
    catchment_id: str
        Id of the catchment for initiating the trace

    Returns
    -------
    Tuple[List, List]
        All waterbody and nexus ids upstream of
        `catchment_id` in the form: (waterbody ids [List], nexus ids [List])
    """

    # clean and merge nexus and flowline data, keep all records
    nexus_sub = nexus[["id", "toid"]]
    nexus_sub = nexus_sub.rename(columns={"id": "from-nexus", "toid": "wb-id"})
    flow_sub = flow[["id", "toid", "divide_id"]]
    flow_sub = flow_sub.rename(columns={"id": "wb-id", "toid": "to-nexus"})
    merged = nexus_sub.merge(flow_sub, on=["wb-id", "wb-id"], how="outer")

    # create directional graph of these data, build graph in reverse order
    print("Building Graph Network")
    G = nx.DiGraph()
    for _, row in merged.iterrows():
        if not pd.isnull(row["from-nexus"]):# and not pd.isnull(row['to-nexus']):
            G.add_edge(row["to-nexus"], row["from-nexus"])
        G.add_edge(row["to-nexus"], row["wb-id"], divide_id=row["divide_id"])

    # get starting node
    start_nexus = merged.loc[merged["wb-id"] == catchment_id]["to-nexus"].item()

    # perform depth first search
    subG = nx.dfs_tree(G, start_nexus)

    # separate wb- and nex- elements into lists
    wbs = []
    nex = []
    for i in list(subG.nodes()):
        if i[0:2] == "wb":
            wbs.append(i)
        else:
            nex.append(i)

    logging.info("Identified:")
    logging.info(f"  - {len(wbs)} waterbody locations")
    logging.info(f"  - {len(nex)} nexus locations ")

    return wbs, nex


def subset_upstream(hydrofabric: str, ids: str) -> None:
    """
    Function to peform hydrofabric subsetting on the "pre-release" dataset.
    
    Parameters
    ----------
    hydrofabric: str
        Path to the hydrofabric geodatabase that will subset.
    ids: str
        Nextgen Hydrofabric waterbody id to initiate upstream subsetting.

    """
    print(hydrofabric)
    
    # load layers
    loader = LoadGDB(hydrofabric)
    layers = loader.list_gdb_layers()
    divides = loader.read_gdb_layer(layer="divides")
    nexus = loader.read_gdb_layer(layer="nexus")
    flow = loader.read_gdb_layer(layer="flowpaths")

    # trace upstream
    wb_ids, nex_ids = get_upstream_ids(nexus, flow, ids)

    for layer in layers:
        logging.info(layer)

    logging.info("Subsetting Flowpaths")
    flowpaths = (
        loader.read_gdb_layer(layer="flowpaths")
        .set_index("id")
        .loc[wb_ids]
        .reset_index()
    )

    logging.info("Subsetting Divides")
    divides = divides.set_index("id").loc[wb_ids].reset_index()

    logging.info("Subsetting Nexus")
    nexus = nexus.set_index("id").loc[nex_ids].reset_index()

    logging.info("Subsetting Edge List")
    flowpath_edge_list = (
        loader.read_gdb_layer(layer="network")
        .set_index("id")
        .loc[nex_ids + wb_ids]
        .reset_index()
    )

    logging.info("Subsetting Flowpath Attributes")
    flowpath_attributes = (
        loader.read_gdb_layer(layer="flowpath_attributes")
        .set_index("id")
        .loc[wb_ids]
        .reset_index()
    )

    logging.info("Subsetting Model Attributes")
    cat_ids = list(map(lambda x: x.replace("wb", "cat"), wb_ids))
    p = Path(hydrofabric)
    vpu = p.parts[-1].split('_')[-1][0:2]
    parquet_name = f'nextgen_{vpu}_cfe_noahowp.parquet'
    parquet_path =  (str(Path(*p.parts[0:-1])/parquet_name).
                     replace(':/','://'))
    model_attributes = pq.ParquetDataset(
        parquet_path,
        filesystem=s3fs.S3FileSystem(anon=True),
    ).read_pandas().to_pandas()
    model_attributes = (model_attributes
                        .set_index("divide_id")
                        .loc[cat_ids])

    # Unsure if hydrolocations and lakes are being subset correctly.
    logging.info('Subsetting Hydro Locations')
    hydro_locations = loader.read_gdb_layer(layer="hydrolocations")
    hydro_locations = hydro_locations.loc[hydro_locations['id'].isin(nex_ids)]

    logging.info('Subsetting Lake Attributes')
    lake_attributes = loader.read_gdb_layer(layer="lakes")
    lake_attributes = lake_attributes.loc[lake_attributes.toid.isin(wb_ids)]

    ### HACK TO FIX T-ROUTE ISSUE
    ### T-route will only work with "ids" starting with "cat"
    ### therefore we need to replace occurrences of "wb-*" with "cat-*"
    logging.info("Replacing 'wb-' with 'cat-' to fix known bug in T-Route")
    divides['id'].replace('wb', 'cat', regex=True, inplace=True)
    flowpaths['id'].replace('wb', 'cat', regex=True, inplace=True)
    flowpath_edge_list['toid'].replace('wb', 'cat', regex=True, inplace=True)
    flowpath_attributes['id'].replace('wb', 'cat', regex=True, inplace=True)
    lake_attributes['toid'].replace('wb', 'cat', regex=True, inplace=True)
    nexus['toid'].replace('wb', 'cat',regex=True, inplace=True)
    
    # save outputs
    logging.info("Saving Subsets to GeoPackage")
    name = f"{ids}_upstream_subset.gpkg"
    flowpaths.to_file(name, layer="flowpaths")
    divides.to_file(name, layer="divides")
    nexus.to_file(name, layer="nexus")
    flowpath_edge_list.to_file(name, layer="flowpath_edge_list")
    flowpath_attributes.to_file(name, layer="flowpath_attributes")
    hydro_locations.to_file(name, layer="hydrolocations")
    lake_attributes.to_file(name, layer="lakes")
    model_attributes.to_csv("cfe_noahowp_attributes.csv")

    # make geojsons
    logging.info("Saving Geo JSON")
    make_geojson(name)
    
    #### ----- added to support creating inputs for the the workshop
    #### ----- update this later!
    #### ----- changing all wb-* to cat-* in the json files
    import re
    
    with open('catchments.geojson', 'r') as file:
        file_contents = file.read()
    substituted_contents = re.sub(r'wb', r'cat', file_contents)
    with open('catchments.geojson', 'w') as file:
        file.write(substituted_contents)
        
    with open('nexus.geojson', 'r') as file:
        file_contents = file.read()
    substituted_contents = re.sub(r'wb', r'cat', file_contents)
    with open('nexus.geojson', 'w') as file:
        file.write(substituted_contents)
        
    #### ---------------------------------------
    
if __name__ == "__main__":

    # get the command line parser
    parser = argparse.ArgumentParser(description="Subset provided hydrofabric")
    parser.add_argument(
        "hydrofabric", type=str, help="Path or link to hydrofabric geopkg to"
    )
    parser.add_argument("upstream", type=str, help="id to subset upstream from")
    parser.add_argument('-v', '--verbose', help="verbose stdout", action="store_const", 
                        dest="loglevel", const=logging.INFO)

    args = parser.parse_args()
    logging.basicConfig(level=args.loglevel)
    
    subset_upstream(args.hydrofabric, args.upstream)
