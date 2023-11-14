FROM r-base:4.1.1

RUN apt update \
 && apt-get remove binutils -y \
 && apt install -y \
 curl \
 libcurl4 \
 libssl-dev \
 libxml2-dev \
 libgdal-dev \
 proj-bin \
 netcdf-bin \
 nco \
 build-essential \ 
 libfontconfig1-dev \
 libharfbuzz-dev \ 
 libfribidi-dev \
 gfortran \
 && rm -rf /var/lib/apt/lists/*

# Install R-WRFHYDRO
RUN install.r remotes ncdf4 raster \
    && curl -fsSL https://api.github.com/repos/NCAR/rwrfhydro/tarball/HEAD -o /tmp/rwrfhydro.tar.gz

RUN R -e "remotes::install_local('/tmp/rwrfhydro.tar.gz', dependencies=T)" \
    && rm -rf /tmp/downloaded_packages 

# install and configure miniconda in /opt/miniconda so that it's accessible
# to all system users. 
ENV CONDA_PATH=/opt/miniconda

# needs to be declared separately from CONDA_PATH since it uses that
# environment variable
ENV PATH=$CONDA_PATH/bin:$CONDA_PATH/condabin:$PATH

# install conda
RUN wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh \
 && sh Miniconda3-latest-Linux-x86_64.sh -b -p $CONDA_PATH \
 && rm -f Miniconda3-latest-Linux-x86_64.sh 

# install python dependencies
RUN conda install -y -c conda-forge \
    gdal \
    pyproj \
    xarray \
    shapely \
    pyshp \
    typer


# make directories for subsetting operation
# scripts: contains R subsetting scritps
# output: empty directory to put subsetting output.
# 	  this should be used to mount and external dir into the container
# domain: empty dir for data that will be subset
# 	  this should be used to mount input data into the container
RUN mkdir /srv/scripts /srv/output /srv/domain


# add WRF-HYDRO v1 subsetting scripts
COPY subset_domain.R /srv/scripts/subset_domain.R
COPY Utils_ReachFiles.R /srv/scripts/Utils_ReachFiles.R
COPY entry.py /srv/entry.py

WORKDIR /srv
ENTRYPOINT ["python", "-u", "entry.py"]
