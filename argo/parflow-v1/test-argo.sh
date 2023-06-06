#!/bin/bash

PFVOL="/Volumes/ColdStorage/subsetter/domain-data/pfconus.v1.0"
IMAGE="cuahsi/parflow-subset-argo:v1"
OUTPUT="$(pwd)/shape"

docker run --rm -ti \
	--env PFINPUT=/srv/input \
	--env SHAPE=/srv/output/watershed.shp \
	--env OUTPUT=/srv/output \
	--env LABEL=my_job \
        -v $OUTPUT:/srv/output \
        -v $PFVOL:/srv/input \
	--entrypoint=/bin/bash \
       $IMAGE

#docker run --rm \
#        -v $OUTPUT:/srv/output \
#        -v $PFVOL:/srv/input \
#        -v $SHAPE:/srv/shape \
#        $IMAGE \
#	'test' '/srv/shape/watershed.shp' '/srv/input' '/srv/output'
