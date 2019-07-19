#!/usr/bin/env bash



set -eu
set -o pipefail

# get sudo rights before user walks away
sudo ls > /dev/null 

cd /tmp

# Install R
echo "-------------------"
echo "| INSTALLING R3.4 |"
echo "-------------------"

sudo yum update

sudo yum groupinstall -y "Development Tools"

sudo yum install -y ncurses-devel zlib-devel texinfo gtk+-devel gtk2-devel qt-devel tcl-devel tk-devel kernel-headers kernel-devel readline-devel gdal.x86_64 gdal-devel.x86_64 gdal-libs.x86_64 proj.x86_64 proj-devel.x86_64 proj-epsg.x86_64 proj-nad.x86_64 netcdf-devel nco libxml2-devel libpng-devel bzip2 bzip2-devel openssl-devel libcurl libcurl-devel libjpeg-turbo-devel
 
wget https://cran.r-project.org/src/base/R-3/R-3.3.3.tar.gz
tar xvzf R-3.3.3.tar.gz
cd R-3.3.3
./configure --with-x=no
make
sudo make install


# Install R-WRF-Hydro
echo "--------------------------"
echo "| INSTALLING R=WRF-Hydro |"
echo "--------------------------"
mkdir $HOME/.userRLib
echo "options(repos=structure(c(CRAN=\"http://archive.linux.duke.edu/cran\")))" >> $HOME/.Rprofile
/usr/local/bin/Rscript -e "install.packages('devtools')"
/usr/local/bin/Rscript -e "install.packages('rgdal')" 
/usr/local/bin/Rscript -e "install.packages('ncdf4')"
/usr/local/bin/Rscript -e "install.packages('RNetCDF')"
/usr/local/bin/Rscript -e "install.packages('ggmap')"
/usr/local/bin/Rscript -e "install.packages('dataRetrieval')"
/usr/local/bin/Rscript -e "install.packages('data.table', dependencies=TRUE)"
/usr/local/bin/Rscript -e "devtools::install_github('NCAR/rwrfhydro')"



wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
chmod +x Miniconda3-latest-Linux-x86_64.sh
./Miniconda3-latest-Linux-x86_64.sh
source ~/.bashrc
conda create -n subset python=3 -y
source activate subset
conda install -y tornado pyproj
pip install multiprocessing-logging



#
#
#
#
#
#
#
