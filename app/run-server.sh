#!/usr/bin/env bash

gunicorn --reload --timeout=300 -b 0.0.0.0:8080 app:api
