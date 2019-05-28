# CONUS Subsetting

This project is an experimental web service for subsetting model domain files at CONUS scales.

## Installation

This instructions are for a completely fresh install on a CentOS 7 Linux box.

1. Update Centos7 packages, and install git, vim, screen
```
yum update
yum install -y vim screen libcurl-devel openssl-devel libjpeg*devel* netcdf*devel* hdf-devel gdal gdal-devel proj proj-devel udunits2-devel libxml2-devel

yum groupinstall 'Development Tools'
```

2. Install Anaconda or Miniconda
```
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
sh Miniconda3-latest-Linux-x86_64.sh
rm Miniconda3-latest-Linux-x86_64.sh
source ~/.bashrc
conda config --set auto_activate_base false
conda config --append channels conda-forge
```

4. create the environment for running the subsetter
```
conda env create -f environment.yml
```

5. Prepare data directories
```
VERSION=nwm.v1.2.4
mkdir /share/appdata
mkdir /share/appdata/output 

cd /share
wget -r -np -nH -R "index.html*" --cut-dirs=5 https://www.nco.ncep.noaa.gov/pmb/codes/nwprod/$VERSION/parm/domain/
mv domain $VERSION
```

6. Install R 
```
yum install epel-release
yum install R
```

Search for CRAN repositories in the USA
```
https://cran.r-project.org/mirrors.html
```

Choose a mirror and set it to the defualt using the following command
```
URL=https://mirrors.nics.utk.edu/cran/
echo "options(repos=structure(c(CRAN=\"$URL\")))" > ~/.Rprofile
```

7. Install R libraries for WRF-Hydro subsetting
```
R
> install.packages(c('devtools', 'rgdal', 'RNetCDF', 'ggmap', 'dataRetrieval', 'data.table'), dependencies=TRUE)
> devtools::install_github("NCAR/rwrfhydro")
```

# Configure Environment Settings



# Setup

1. Install R 3.3

2. Install Python 3

3. Open firewall ports
   - `$ sudo iptables -I INPUT 1 -i eth0 -p tcp --dport 8000 -j ACCEPT`


