#!/bin/bash

echo "Removing existing image"
minikube image rm $(minikube image ls | grep castrona/rq-worker:2)

echo "Loading new image"
minikube image load castrona/rq-worker:2

echo "Done"
