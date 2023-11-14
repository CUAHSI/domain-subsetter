FROM python:slim-bullseye

RUN apt update && apt install -y \
    git \
    vim \ 
  && rm -rf /var/lib/apt/lists/*

WORKDIR /srv

COPY requirements.txt /tmp/requirements.txt

RUN pip install -r /tmp/requirements.txt

RUN mkdir /srv/output

COPY entry.py /srv/entry.py

COPY subset.py /srv/subset.py

RUN echo "BUILDING IS COMPLETE"

ENTRYPOINT ["python", \
            "entry.py"]

