import pyproj


def transform_latlon(y_south: float, x_west: float, y_north: float, x_east: float):
    print(f"y_south={y_south}")
    print(f"y_north={y_north}")
    print(f"x_west={x_west}")
    print(f"x_east={x_east}")
    # define a target coordinate system and convert the geometry data into the projection of our forcing data
    target_crs = pyproj.Proj(
        proj='lcc', lat_1=30.0, lat_2=60.0, lat_0=40.0000076293945, lon_0=-97.0, a=6370000, b=6370000  # Center point
    )

    transformer = pyproj.Transformer.from_crs("EPSG:4326", target_crs.crs)
    x_west, y_south, x_east, y_north = transformer.transform_bounds(x_west, y_south, x_east, y_north, always_xy=True)
    # x_west, y_south, x_east, y_north = transformer.itransform([(x_west, south, y_south, x_east, y_north])
    print(f"y_south={y_south}")
    print(f"y_north={y_north}")
    print(f"x_west={x_west}")
    print(f"x_east={x_east}")
    return y_south, x_west, y_north, x_east
