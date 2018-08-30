#!/usr/bin/env bash

# call basic subsetting function
# bbox coodinates are specified in WGS 1984
#curl 0.0.0.0:8080/SubsetWithBBox?llat=38.433\&llon=-90.5734\&ulat=38.828\&ulon=-89.911
wget -O out.tar.gz 0.0.0.0:8080/SubsetWithBbox?llat=38.433\&llon=-90.5734\&ulat=38.828\&ulon=-89.911
