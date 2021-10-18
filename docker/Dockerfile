FROM centos:centos7.7.1908

# need to install epel-release before the packages below.
RUN yum install -y \
    epel-release \
    deltarpm \
    && yum -y groupinstall "Development Tools" \
&& yum clean all \
&& rm -rf /var/cache/yum

RUN yum update -y \
&& yum install -y \
    wget \
    git \
    vim \
    screen \
    libcurl-devel \
    openssl-devel \
    libjpeg*devel* \
    netcdf*devel* \
    hdf-devel \
    gdal \
    gdal-devel \
    proj \
    proj-devel \
    proj-epsg \
    proj-nad \
    udunits2-devel \
    libxml2-devel \
    nco \
    libpng-devel \
    R \
&& yum clean all \
&& rm -rf /var/cache/yum

RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
&& sh Miniconda3-latest-Linux-x86_64.sh -b -p /opt/miniconda3 \
&& rm -f Miniconda3-latest-Linux-x86_64.sh \
&& /opt/miniconda3/bin/conda init \
&& /opt/miniconda3/bin/conda config --set auto_activate_base false \
&& /opt/miniconda3/bin/conda config --add channels conda-forge \
&& /bin/bash -c "source ~/.bashrc"

# set up aliases bc activating conda within a Dockerfile is problematic
ENV CONDA=/opt/miniconda3/bin/conda
ENV WRF_INSTALL="$CONDA run -n wrfhydro /bin/bash -c"

RUN $CONDA create -n wrfhydro python=3 -y \
&& cp /usr/share/proj/proj_def.dat /opt/miniconda3/envs/wrfhydro/share/proj 

ENV PATH /opt/miniconda3/envs/wrfhydro/bin:$PATH

RUN echo "options(repos=structure(c(CRAN=\"https://mirrors.nics.utk.edu/cran/\")))" > ~/.Rprofile \
&& R -e "install.packages(c('devtools', 'rgdal', 'RNetCDF', 'ggmap', 'dataRetrieval', 'data.table', 'ncdf4', 'iterators', 'foreach'), dependencies=TRUE, INSTALL_opts=c('--no-help', '--no-html'))"

ENV R_REMOTES_NO_ERRORS_FROM_WARNINGS=true

RUN mkdir -p /usr/share/doc/R-3.6.0/html \
&& R -e "devtools::install_github('NCAR/rwrfhydro')"


#RUN cd /tmp \
#&& git clone https://github.com/NCAR/rwrfhydro.git 
#&& cp /usr/lib64/R/library/stats/html/R.css /usr/share/doc/R-3.6.0/html \
#RUN cd /tmp \
#&& R -e "install.packages(c('rematch2'), dependencies=TRUE, INSTALL_opts=c('--no-help', '--no-html'))" \
#&& R -e "devtools::install_deps('./rwrfhydro', build_opts=c('--no--help', '--no-html'))" 
#&& R --vanilla CMD INSTALL ./rwrfhydro --no-help --no-html

#&& R -e "devtools::install_github('NCAR/rwrfhydro', INSTALL_opts=c('--no-help', '--no-html'))"
#devtools::install_github('NCAR/rwrfhydro', args=c('--no-help', '--no-html'))
# cannot create file '/usr/share/doc/R-3.6.0/html/packages.html', reason 'No such file or directory'
# R --vanilla CMD INSTALL ./rwrfhydro --no-help --no-html

# initialize conda for the new user
# RUN /opt/miniconda3/bin/conda init 

