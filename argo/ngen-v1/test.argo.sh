#!/bin/bash

# specify the folder path
folder="$(pwd)/output"

# create the output directory
if [ ! -d "$folder" ]; then
        mkdir -p "$folder"
else
        rm -f "$folder"/*
fi

IMAGE="igarousi/ngen-subset-argo:v1"
OUTPUT_PATH="$(pwd)/output"
ds_name="wb-2915523"
vpu_id="16"
input_url="s3://nextgen-hydrofabric/pre-release/"

docker run --rm -ti \
        -v $OUTPUT_PATH:/srv/output \
	-e NAME=$ds_name \
	-e VPU=$vpu_id \
	-e HYDROFABRIC_URL=$input_url \
	-e OUTPUT=/srv/output \
        $IMAGE 


