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


```
vim nwm_subsetting/tornado-app/environment.py

# adjust settings, e.g. :

address="0.0.0.0"
port="80"

debug=True
static_path = os.path.join(os.path.dirname(__file__), "static")
template_path = os.path.join(os.path.dirname(__file__), "templates")

# multiprocessing settings
worker_count = 4

# logging settings
log_dir = os.path.join(os.getcwd(), 'logs')
log_file_size = 1024 * 20 * 1000
log_count = 10

# levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
access_level = 'INFO'
application_level = 'INFO'
general_level = 'INFO'

# WRF-HYDRO settings
wrfdata = '/share/nwm.v1.2.4'

# Output subset directory
output_dir = '/share/appdata/output'

# Location of jobs database
sqldb = '/share/appdata/jobs.db'
```

# Build Bounding Box Lookup Database

todo

# Start the Server

There are many ways to run the server, one simple method is shown below.
```
screen -S server
cd nwm_subsetting/tornado-app/
conda activate subset
./app.py
```

# Setup

1. Install R 3.3

2. Install Python 3

3. Open firewall ports
   - `$ sudo iptables -I INPUT 1 -i eth0 -p tcp --dport 8000 -j ACCEPT`


