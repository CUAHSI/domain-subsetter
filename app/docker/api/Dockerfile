FROM python:3.10-slim

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# remove requirements-dev installation for deployments
COPY requirements-dev.txt requirements-dev.txt
RUN pip install -r requirements-dev.txt

ENV PYTHONPATH "${PYTHONPATH}:/"

EXPOSE 8000

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["python api/main.py"]