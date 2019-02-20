# nwm_subsetting

This project is an experimental web service for subsetting National Water Model domain files.


## Installing libraries
1. Install Anaconda or Miniconda
2. conda config --append channels conda-forge
3. conda create -n subset --file requirements.txt -y
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


