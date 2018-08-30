#!/usr/bin/env bash
#
#
##sudo yum install -y gdal.x86_64 gdal-devel.x86_64 gdal-libs.x86_64 proj.x86_64 proj-devel.x86_64 proj-epsg.x86_64 proj-nad.x86_64 netcdf-devel nco libxml2-devel libpng-devel
#
#
#yum install gdal gdal-devel proj proj-devel epsg nad netcdf-devel nco libxml2-devl libpng-devel
#
## install python libraries
#conda install -y xarray numpy tornado 
#conda install -c r r-base r-devtools
#
#
##conda install -c r r=3.4
## commented out because something from conda forge is breaking 
##conda install -c conda-forge -y r-rgdal r-ncdf4 r-rnetcdf r-ggmap 
##conda install -y -c r r-devtools
#conda install -y rpy2
#
##Rscript -e "install.packages('rgdal')"
##Rscript -e "install.packages('RNetCDF')"
##Rscript -e "install.packages('ggmap')"
##Rscript -e "devtools::install_github('NCAR/rwrfhydro')"
#
#
#cd /tmp
#conda install -c conda-forge -y r-ggmap r-rgdal
#Rscript -e "install.packages('foreach')"
#Rscript -e "install.packages('RCurl')"
#Rscript -e "install.packages('raster')"
#Rscript -e "install.packages('ncdf4')"
#Rscript -e "install.packages('dataRetrieval')"
#Rscript -e "install.packages('data.table', dependencies=TRUE)"
##Rscript -e "install.packages('rgdal')"
#git clone https://github.com/NCAR/rwrfhydro.git
#Rscript -e "system('R CMD INSTALL /tmp/rwrfhydro')"


# working installation steps
sudo yum install gdal gdal-devel proj proj-devel epsg nad netcdf-devel nco libxml2-devl libpng-devel
conda create -n r-gis
conda install -c conda-forge -y r-essentials geos r-rgeos r-rgdal r-devtools
conda install -c conda-forge -y r-ncdf4 r-ggmap r-rcurl r-raster
Rscript -e "install.packages('dataRetrieval')"
Rscript -e "install.packages('data.table')"
git clone https://github.com/NCAR/rwrfhydro.git
Rscript -e "system('R CMD INSTALL /tmp/rwrfhydro')"
conda install -y xarray numpy tornado

yum install readline readline-devel
pip install rpy2

