#!/bin/bash

PFVOL="/Volumes/ColdStorage/subsetter/domain-data/pfconus.v1.0"
IMAGE="cuahsi/parflow-subset-argo:v1_1"
SHAPE="$(pwd)/shape"
OUTPUT="$(pwd)/output"

docker run --rm -ti \
        -v $OUTPUT:/srv/output \
        -v $PFVOL:/srv/input \
        -v $SHAPE:/srv/shape \
	--entrypoint=/bin/bash \
       $IMAGE

#docker run --rm \
#        -v $OUTPUT:/srv/output \
#        -v $PFVOL:/srv/input \
#        -v $SHAPE:/srv/shape \
#        $IMAGE \
#	'test' '/srv/shape/watershed.shp' '/srv/input' '/srv/output'
