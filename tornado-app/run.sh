#!/bin/bash

# run using:  $sudo ./run.sh

export GDAL_DATA="/home/acastronova/.conda/envs/subsetting-server/share/gdal"
export PROJ_LIB="/home/acastronova/.conda/envs/subsetting-server/share/proj"
/home/acastronova/.conda/envs/subsetting-server/bin/python app.py
