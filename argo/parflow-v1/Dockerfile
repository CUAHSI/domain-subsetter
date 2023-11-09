FROM python:slim-bullseye

RUN apt update && apt install -y \
    curl \
    build-essential \ 
    git \ 
    gfortran \ 
    libopenblas-dev \ 
    liblapack-dev \ 
    openmpi-bin \ 
    libopenmpi-dev \ 
    tcl-dev \ 
    tk-dev \
    cmake \
    libcurl3-dev \
    python3.9 \
    python3.9-distutils \
    python3.9-dev \
    libgdal-dev=3.2.2* \
  # clean up
  && rm -rf /var/lib/apt/lists/* 

WORKDIR /srv

############################
# Install Parflow Binaries #
############################

ENV PARFLOW_DIR=/usr/local \
    PATH=$PATH:$PARFLOW_DIR/bin \
    PARFLOW_MPIEXEC_EXTRA_FLAGS="--mca mpi_yield_when_idle 1 --oversubscribe --allow-run-as-root"

# Hypre
RUN curl -L https://github.com/hypre-space/hypre/archive/v2.17.0.tar.gz -o v2.17.0.tar.gz \
 && tar -xf v2.17.0.tar.gz \
 && cd hypre-2.17.0/src \
 && ./configure --prefix=$PARFLOW_DIR \
 && make install \
 && cd ../.. && rm -fr hypre-2.17.0 v2.17.0.tar.gz

# Silo
RUN curl -L https://wci.llnl.gov/sites/wci/files/2021-09/silo-4.11.tgz -o silo-4.11.tgz \
 && tar -xf silo-4.11.tgz \
 && cd silo-4.11 \
 && ./configure  \
    --prefix=$PARFLOW_DIR \
    --disable-silex \
    --disable-hzip \
    --disable-fpzip \
 && make install \
 && cd .. && rm -rf silo-4.11 silo-4.11.tgz

# ParFlow 
RUN git clone -b master --single-branch https://github.com/parflow/parflow.git parflow \
 && mkdir -p build \
 && cd build \
 && CC=mpicc CXX=mpic++ LDFLAGS="-lcurl" cmake ../parflow \
    -DPARFLOW_AMPS_LAYER=mpi1 \
    -DPARFLOW_AMPS_SEQUENTIAL_IO=TRUE \
    -DHYPRE_ROOT=$PARFLOW_DIR \
    -DSILO_ROOT=$PARFLOW_DIR \
    -DPARFLOW_ENABLE_TIMING=TRUE \
    -DPARFLOW_HAVE_CLM=TRUE \
    -DCMAKE_INSTALL_PREFIX=$PARFLOW_DIR \
 && make install \
 && cd .. && rm -fr parflow build

###########################
# Install Python Packages #
###########################

# Change to python 3.9
# gdal issues with python 3.10 and greater due to lib2to3 being deprecated
RUN update-alternatives --install /usr/local/bin/python python /usr/bin/python3.9 1 \
 && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
 && python get-pip.py 

# The following two steps need to be separate so that
# GDAL is installed using setuptools<58.0
RUN pip install \
    numpy \
    "setuptools<58.0" \
    swig \
    pyshp \ 
    typer \
    shapely \
    requests
# GDAL Python bindings must be installed **after** setuptools is downgraded.
RUN pip install \
    GDAL==$(gdal-config --version | awk -F'[.]' '{print $1"."$2}')

# Compile parflowio and install parflow_subsetter
RUN git clone https://github.com/hydroframe/parflowio.git \
 && cd parflowio \
 && cmake -S . -B build -DBUILD_PYTHON=ON \
 && cmake --build build \
 && pip install build/python/parflowio/ \
 # install parflow_subsetter package
 && pip install parflow_subsetter

# Make directories for input and output data
RUN mkdir /srv/input /srv/output /srv/shape /tmp/outputs
COPY entry.py /srv/entry.py

ENTRYPOINT ["python", \ 
	    "-u", \
	    "entry.py", \
	    "subset", \
	    "/srv/shape/watershed.shp", \
	    "/srv/input", \
	    "/srv/output"]
