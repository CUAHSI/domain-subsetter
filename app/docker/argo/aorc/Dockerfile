FROM pandas/pandas:pip-minimal


RUN pip install \
    s3fs \
    fsspec \
    xarray \
    zarr \
    dask['distributed'] \
    geopandas \
    rioxarray \
    boto3 \
    netcdf4 

COPY collect-aorc-forcing-v1.1.py /app/collect-aorc-forcing-v1.1.py