#!/bin/bash

# specify the folder path
folder="$(pwd)/output"

# create the output directory
if [ ! -d "$folder" ]; then
	mkdir -p "$folder"
else
	rm -f "$folder"/*
fi

# define docker image and output directory
IMAGE="cuahsi/ngen-subset:v1"
OUTPUT="$(pwd)/output"

# run the docker
# The two input arguments are for the following example are wb-2915523 (outlet catchment) and 16 (VPU ID)
docker run --rm -ti \
	-v $(pwd)/entry.py:/srv/entry.py \
	-v $OUTPUT:/srv/output \
	$IMAGE wb-2915523 16 
        
