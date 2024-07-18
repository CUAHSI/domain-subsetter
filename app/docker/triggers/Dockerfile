FROM python:3.10-slim

WORKDIR /app

COPY ./docker/triggers/requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENV PYTHONPATH "${PYTHONPATH}:/app/api/"
ENV PYTHONPATH "${PYTHONPATH}:/app/triggers/"