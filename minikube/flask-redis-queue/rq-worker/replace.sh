#!/bin/bash

kubectl delete -f rq-worker-deployment.yaml

./load.sh

kubectl create -f rq-worker-deployment.yaml

