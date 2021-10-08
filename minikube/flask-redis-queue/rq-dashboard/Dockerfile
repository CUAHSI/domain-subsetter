FROM python:3.8.12-buster

COPY requirements.txt .
RUN pip install -r requirements.txt

EXPOSE 9181
CMD ["rq-dashboard", "--port", "9181", \
                     "--redis-host", "redis-master", \
                     "--redis-port", "6379"]
