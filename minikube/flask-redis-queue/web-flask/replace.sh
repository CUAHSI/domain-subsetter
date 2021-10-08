#!/bin/bash
kubectl delete -f web-flask-deployment.yaml
kubectl delete -f web-flask-service.yaml

./load.sh

kubectl create -f web-flask-deployment.yaml
kubectl create -f web-flask-service.yaml
