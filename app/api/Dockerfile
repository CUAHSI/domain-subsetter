FROM python:3.10-slim

ARG MINIO_API_URL
ARG MINIO_ACCESS_KEY
ARG MINIO_ACCESS_SECRET

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# remove requirements-dev installation for deployments
COPY requirements-dev.txt requirements-dev.txt
RUN pip install -r requirements-dev.txt

RUN apt-get update
RUN apt-get install -y wget
RUN wget https://dl.min.io/client/mc/release/linux-amd64/mc
RUN chmod +x mc
RUN mv mc /usr/local/bin/mc

RUN mc alias set cuahsi https://$MINIO_API_URL $MINIO_ACCESS_KEY $MINIO_ACCESS_SECRET

COPY ./subsetter /subsetter

ENV PYTHONPATH "/subsetter/:${PYTHONPATH}"

EXPOSE 8000

CMD uvicorn --host 0.0.0.0 --port 8000 --proxy-headers subsetter.main:app