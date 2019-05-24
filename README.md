# CONUS Subsetting

This project is an experimental web service for subsetting model domain files at CONUS scales.

## Installation

This instructions are for a completely fresh install on a CentOS 7 Linux box.

1. Update Centos7 packages, and install git, vim, screen
```
yum update
yum install -y vim screen
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
conda create -n subset --file requirements.txt -y
```

4. source subset

## make data directories
1. mkdir /share/[data-version]
2. mkdir /share/appdata
3. mkdir /share/appdata/output 

# Setup

1. Install R 3.3

2. Install Python 3

3. Open firewall ports
   - `$ sudo iptables -I INPUT 1 -i eth0 -p tcp --dport 8000 -j ACCEPT`


