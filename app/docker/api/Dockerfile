FROM python:3.10-slim

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

ENV PYTHONPATH "${PYTHONPATH}:/"

EXPOSE 8000

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["python api/main.py"]