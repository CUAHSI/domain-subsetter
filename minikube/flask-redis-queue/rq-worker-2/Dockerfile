FROM python:3.7.9
#FROM castrona/web-flask-rq:v5

# does this need to inherit from web-flask?
# I want to have these jobs run on specially configured machines
# with custom subsetting scripts on each one.

WORKDIR /srv

COPY ./requirements.txt .
COPY ./settings.py .
ADD ./tasks ./tasks


RUN pip install -r requirements.txt


CMD ["rq", "worker", "job2", "--config", "settings"]
