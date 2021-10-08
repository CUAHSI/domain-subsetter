from flask import Flask, jsonify, request
from redis import Redis
from rq import Queue

#from random import randrange

#from settings import REDIS_HOST, REDIS_PORT
import rq_dashboard
import settings

#import tasks

app = Flask(__name__)
app.config.from_object(rq_dashboard.default_settings)
app.config.from_object(settings)
app.register_blueprint(rq_dashboard.blueprint, url_prefix='/dashboard')


redis_conn = Redis(host=settings.REDIS_HOST,
                   port=settings.REDIS_PORT)
queues = {'default': Queue(connection=redis_conn),
          'job2': Queue('job2', connection=redis_conn)}


@app.route("/")
def submit_job():

    # get the queue to submit the job to
    qname = request.args.get('queue_name', 'default')
    q = queues.get(qname, 'default')

    # todo: look at on_failure and on_success callbacks
    # https://python-rq.org/docs/
    job = q.enqueue('tasks.sysinfo.print_worker', **request.args)

    return jsonify(job_id=job.get_id())


@app.route('/finished')
def get_finished():
    # get the queue to submit the job to
    qname = request.args.get('queue_name', 'default')
    q = queues.get(qname, 'default')
    return jsonify(finished=q.finished_job_registry.get_job_ids())


@app.route('/queue')
def get_queue():

    queued_jobs = {}
    for k, q in queues.items():
        queued_jobs[k] = q.job_ids
    return jsonify(queued_jobs)


@app.route("/results")
@app.route("/results/<string:job_id>")
def get_results(job_id=None):

    # return all jobs if job_id is not provided
    if job_id is None:
        return f"URL is missing Job ID, e.g. /results/<job-id>"

    # get the job associated with the job_id
    job = None
    for k, q in queues.items():
        job = q.fetch_job(job_id)

        # exit if a job is found
        if job is not None:
            break

    # return and error if no job is not found
    if job is None:
        return f"Could not find job id: {job_id}"

    # the job failed
    if job.is_failed:
        return "Job has failed!", 400

    # the job finished
    if job.is_finished:
        return jsonify(result=job.result)

    return "Job has not finished!", 202


if __name__ == "__main__":
    # Start server
    app.run(host="0.0.0.0", port=8080, debug=True)
