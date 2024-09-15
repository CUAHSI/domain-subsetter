FROM python:3.10-slim

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# remove requirements-dev installation for deployments
COPY requirements-dev.txt requirements-dev.txt
RUN pip install -r requirements-dev.txt

RUN python -m wget https://dl.min.io/client/mc/release/linux-amd64/mc
RUN chmod +x mc
RUN mv mc /usr/local/bin/mc

COPY ./subsetter /subsetter

# https://www.digicert.com/kb/digicert-root-certificates.htm
# Get the .pem file from digicert and add it to the bundle used by certifi
# Could also use the REQUESTS_CA_BUNDLE environment variable to point to the .pem file
# This was needed beacause the certifi release 
# 2024.02.02 https://github.com/certifi/python-certifi/releases/tag/2024.02.02
# does not include the GeoTrust TLS RSA CA G1 certificate at the time of this writing
# More info: https://requests.readthedocs.io/en/latest/user/advanced/#ca-certificates
RUN apt-get update && apt-get install -y wget && apt-get install -y ca-certificates
RUN wget -O /usr/lib/ssl/certs/GeoTrustTLSRSACAG1.crt.pem https://cacerts.digicert.com/GeoTrustTLSRSACAG1.crt.pem && \
    update-ca-certificates && \
    cat /usr/lib/ssl/certs/GeoTrustTLSRSACAG1.crt.pem >> $(python -c "import requests; print(requests.certs.where())")

ENV PYTHONPATH "/subsetter/:${PYTHONPATH}"

EXPOSE 8000

CMD uvicorn --host 0.0.0.0 --port 8000 --proxy-headers main:app