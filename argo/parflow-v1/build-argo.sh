#!/bin/bash

if [ -z "$1" ]
  then
    TAG='v1'
  else
    TAG=$1
fi
docker build -f Dockerfile.argo -t cuahsi/parflow-subset-argo:$TAG .
