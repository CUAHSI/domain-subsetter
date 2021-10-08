#!/bin/bash

echo "Removing existing image"
minikube image rm $(minikube image ls | grep castrona/web-flask-rq:1)

echo "Loading new image"
minikube image load castrona/web-flask-rq:1

echo "Done"
