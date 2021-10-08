FROM python:3.7.9

WORKDIR /srv

COPY ./requirements.txt .
COPY ./settings.py .
COPY ./app.py .

RUN pip install -r requirements.txt

EXPOSE 8080
CMD ["python", "app.py"]
