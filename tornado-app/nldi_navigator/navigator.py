#!/usr/bin/env python3

"""
The file contains functions for performing NLDI tracing.
Author: araney@cuahsi.org
GitHub: aaraney, https://github.com/aaraney/nldi_navigator

"""

import requests
import pandas as pd
import numpy as np
import geopandas as gpd
from multiprocessing import Pool
from functools import partial
from enum import Enum
from typing import Union

from shapely.geometry import geo


# SITE_INFO_URL = (
#     "https://labs.waterdata.usgs.gov/api/nldi/linked-data/nwissite/USGS-08279500"
# )

# URL = "https://labs.waterdata.usgs.gov/api/nldi/linked-data/nwissite/USGS-08279500/navigation/DD/flowlines?distance=200"
# https://labs.waterdata.usgs.gov/api/nldi/linked-data/nwissite/USGS-01646500/navigation/DD/flowlines?distance=6
# For nhdplus comids:
# https://labs.waterdata.usgs.gov/api/nldi/linked-data/comid/21983115/navigation/UT/flowlines?distance=20

# Notes
# Start point. Will likely need to know the starting comid. Could use nldi to crosswalk or wrds.
# Direction

# Notes about nhd network
# 80% of reach lengths less than 2.983 km
# 95% of reach lengths less than 5.456 km
# 99% of reach lengths less than 9.167 km
# Max length 95.714 km


class NLDISupportedProviders(Enum):
    nwissite = "nwis"  # USGS NWIS
    comid = "comid"  # NHDplus Comid


class NLDINavigators(Enum):
    UM = "UM"  # Upstream main
    UT = "UT"  # Upstream tributaries
    DM = "DM"  # Downstream main
    DD = "DD"  # Downstream diversion


BASE_URL = "https://labs.waterdata.usgs.gov/api/nldi/linked-data/"
# comid | nwissite
# site
# /navigation/{navigator}/flowlines?distance={search_distance}


def _validate_with_enum_return_key_value(value: Union[str, int], enum: Enum):
    try:
        enum_object = enum(value)
        key, value = enum_object.name, enum_object.value
        return key, value
    except ValueError:
        supported_values = ", ".join([x.value for x in enum])
        error_message = "value: %s not supported.\nSupported values: %s" % (
            value,
            supported_values,
        )
        raise ValueError(error_message)


def build_url(site: str, site_provider: str, navigator: str, search_distance: str):
    BASE_URL = "https://labs.waterdata.usgs.gov/api/nldi/linked-data/"

    # Verify that passed arguments pass the smell test
    search_distance = str(search_distance)
    site_provider, _ = _validate_with_enum_return_key_value(
        site_provider.lower(), NLDISupportedProviders
    )
    navigator, _ = _validate_with_enum_return_key_value(
        navigator.upper(), NLDINavigators
    )

    # if this is an nwis site, prepend `USGS` to the site name
    if site_provider == "nwissite":
        site = f"USGS-{site}"

    SUFFIX_URL = f"navigation/{navigator}/flowlines?distance={search_distance}"

    return BASE_URL + site_provider + "/" + site + "/" + SUFFIX_URL


def get_flowlines_by_direction(
    site: str,
    navigation: str = "DD",
    site_provider: str = "nwis",
    search_distance: int = 6,
):
    """
    navigation:
        UM - Upstream main
        UT - Upstream tributaries
        DM - Downstream main
        DD - Downstream diversions
    search_distance:
        Distance to search from start for flowlines (KM). Default, 6
    """
    # search_distance = str(search_distance)
    # URL = f"https://labs.waterdata.usgs.gov/api/nldi/linked-data/nwissite/USGS-{site}/navigation/{navigation}/flowlines?distance={search_distance}"
    query_url = build_url(
        site=site,
        site_provider=site_provider,
        navigator=navigation,
        search_distance=search_distance,
    )

    gdf = gpd.read_file(query_url)

    origin = gdf.iloc[0]

    gdf["is_confluence"] = gdf["geometry"].apply(origin.geometry.touches)
    return gdf


def _get_reaches_helper(site: str, site_provider: str, navigation: str):
    fall_back_search_distances = [6, 10, 100]

    for distance in fall_back_search_distances:
        df = get_flowlines_by_direction(
            site,
            navigation=navigation,
            site_provider=site_provider,
            search_distance=distance,
        )

        if len(df) > 1:
            # Add navigation metadata to df
            df["relative_location"] = navigation

            # Set first entry in df as origin comid
            df.loc[0, "relative_location"] = "origin"
            return df

    # Return empty df if a result was not found
    return pd.DataFrame()


def get_segment_relative_x_postion(df: pd.DataFrame):
    # Number reaches from 0.. from left to right based on their centroid's longitude
    second_x_coord = df["geometry"].apply(lambda row: row.xy[0][1])
    relative_x_position = second_x_coord.sort_values()

    df.loc[
        relative_x_position.index, "relative_x_position"
    ] = relative_x_position.reset_index().index.values

    return df


def get_nearest_upstream_and_downstream_reaches(site: str, site_provider: str):
    navigation_methods = ["UT"]
    part = partial(_get_reaches_helper, site, site_provider)

    with Pool(processes=2) as pool:
        results = pool.map(part, navigation_methods)

    dfs = pd.concat(results, ignore_index=True)

    # Only keep confluences and origins
    dfs = dfs[(dfs["is_confluence"]) | (dfs["relative_location"] == "origin")]

    # Remove duplicate origins persiting from nldi requests
    dfs = dfs.drop_duplicates(subset="nhdplus_comid")

    # Determine plotting x position for reaches by relative_location. The reach
    # farthest west starts at 0 and monotonically increases
    dfs = dfs.groupby("relative_location").apply(get_segment_relative_x_postion)

    # Set the origin's relative_x_location to -1
    dfs.loc[dfs["relative_location"] == "origin", "relative_x_position"] = -1

    return dfs


if __name__ == "__main__":
    dfs = get_nearest_upstream_and_downstream_reaches("08279500")
