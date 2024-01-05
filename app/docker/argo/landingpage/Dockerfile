FROM osgeo/gdal:ubuntu-small-3.5.3

RUN apt-get update
RUN apt-get -y install python3.9
RUN apt-get -y install python3-pip

COPY requirements.txt requirements.txt
RUN python -m pip install -r requirements.txt

COPY dist /dist
COPY convert-schema.py convert-schema.py

RUN mkdir /metadata
#ENV PYTHONPATH "${PYTHONPATH}:/"

ENTRYPOINT ["python", "convert-schema.py"]
#CMD ["python watershed.py"]