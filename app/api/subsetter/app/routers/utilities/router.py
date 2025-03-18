from typing import Any, List

from fastapi import APIRouter
from pydantic import BaseModel
from pyproj import CRS, Transformer
from shapely.geometry import GeometryCollection, Polygon, shape

router = APIRouter()


class GeoJsonGeometry(BaseModel):
    type: str
    coordinates: Any


class GeoJsonFeature(BaseModel):
    type: str
    geometry: GeoJsonGeometry
    properties: dict


class GeoJsonFeatureCollection(BaseModel):
    type: str
    features: List[GeoJsonFeature]


def geojson_to_geometry_collection(
    feature_collection: GeoJsonFeatureCollection,
) -> GeometryCollection:
    """
    Converts a GeoJSON string to a dictionary containing a Shapely GeometryCollection.

    Arguments:
    ==========
    geojson: str - a GeoJSON string representing the geometries.

    Returns:
    ========
    GeometryCollection: a Shapely GeometryCollection object.
    """

    geometries = []

    for feature in feature_collection.features:
        shapely_geom = shape({"type": feature.geometry.type, "coordinates": feature.geometry.coordinates})
        # NOTE: buffer(0) is a trick for fixing scenarios where polygons have overlapping coordinates
        geometries.append(shapely_geom.buffer(0))

    return GeometryCollection(geometries)


def transform_polygon(geom: Polygon, source_crs: str, target_crs: str) -> List:
    """
    Transforms a polygon from the source CRS to the target CRS.

    Arguments:
    ==========
    geom: Polygon - the polygon to transform.
    source_crs: str - the source coordinate reference system (CRS).
    target_crs: str - the target coordinate reference system (CRS).

    Returns:
    ========
    list - a list of transformed coordinates.
    """

    from_crs = CRS(source_crs)
    to_crs = CRS(target_crs)
    transformer = Transformer.from_crs(from_crs, to_crs, always_xy=True)
    pts = [transformer.transform(x, y) for x, y in geom.exterior.coords]
    return pts


@router.post("/nwm/compute_bbox")
async def compute_nwm_bbox(feature_collection: GeoJsonFeatureCollection):
    """
    Computes the bounding box of geometries provided in the WGS 1984 coordinate
    reference system (CRS) in the CRS used by the National Water Model (NWM).

    Arguments:
    ==========
    geojson: str - a GeoJSON string representing the geometries for which to compute the bounding box.

    Returns:
    ========
    dict - a dictionary containing the bounding box in the CRS used by the NWM.
    """

    # initialize the bounding box coordinates
    minx = 10e9
    miny = 10e9
    maxx = -10e9
    maxy = -10e9

    # convert the geojson to a geometry collection
    geometries = geojson_to_geometry_collection(feature_collection)

    # loop through geometries, transform their coordinates, and update the bounding box extent
    for geom in geometries.geoms:
        pts = transform_polygon(
            geom,
            "EPSG:4326",
            "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs",
        )

        xs, ys = zip(*pts)
        minx = min(minx, min(xs))
        miny = min(miny, min(ys))
        maxx = max(maxx, max(xs))
        maxy = max(maxy, max(ys))

    return {"minx": minx, "miny": miny, "maxx": maxx, "maxy": maxy}
