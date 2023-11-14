FROM python:3.10-slim

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

RUN mc alias set cuahsi https://api.minio.cuahsi.io I7GKG576Xle9bsQZeUjY UyY08NY2GZ2ICAy5SC8TWb9KV80l8yCwfr8Dx58n

COPY ./subsetter /subsetter

ENV PYTHONPATH "/subsetter/:${PYTHONPATH}"

EXPOSE 8000

CMD uvicorn --host 0.0.0.0 --port 8000 --proxy-headers subsetter.main:app