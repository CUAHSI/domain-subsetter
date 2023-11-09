#!/bin/bash


#docker run --rm -ti \
#    -v /Volumes/ColdStorage/subsetter/domain-data/nwm.v1.2.4:/srv/domain \
#    -v $(pwd)/output:/srv/output \
#    --entrypoint=/bin/bash \
#    subset-wrfhydro:v1 
#
docker run --rm -ti \
    -v /Volumes/ColdStorage/subsetter/domain-data/nwm.v1.2.4:/srv/domain \
    -v $(pwd)/output:/srv/output \
    subset-wrfhydro:v1 \
    382582.18746 1720355.72762 367584.87840 1734488.45260 /srv/domain /srv/output
