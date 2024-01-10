import json
import logging as log
import uuid
from typing import Annotated

import argo_workflows
import google.cloud.logging as logging
from argo_workflows.api import workflow_service_api
from fastapi import APIRouter, Depends, Query

from subsetter.app.db import Submission, User
from subsetter.app.models import (
    LogsResponseModel,
    SubmissionResponseModel,
    UrlResponseModel,
    UserSubmissionsResponseModel,
    WorkflowDep,
)
from subsetter.app.users import current_active_user
from subsetter.config import get_minio_client, get_settings

from .transformer import transform_latlon

if get_settings().cloud_run:
    logging_client = logging.Client()
    logging_client.setup_logging()

router = APIRouter()

NAMESPACE = 'workflows'

configuration = argo_workflows.Configuration(host=get_settings().argo_host)
configuration.api_key['BearerToken'] = get_settings().argo_bearer_token

api_client = argo_workflows.ApiClient(configuration)
api_instance = workflow_service_api.WorkflowServiceApi(api_client)


def parflow_submission_body(hucs: list, username: str, workflow_name: str):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "parflow-subset-v1-by-huc-minio",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [
                f"output-path=argo_workflows/parflow/{workflow_name}",
                f"output-bucket={username}",
                "hucs=" + ",".join(hucs),
            ],
        },
    }


def nwm1_submission_body(
    y_south: float, x_west: float, y_north: float, x_east: float, username: str, workflow_name: str
):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "nwm1-subset-minio",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [
                f"output-bucket={username}",
                f"output-path=argo_workflows/nwm1/{workflow_name}",
                f"y_south={y_south}",
                f"x_west={x_west}",
                f"y_north={y_north}",
                f"x_east={x_east}",
            ],
        },
    }


def nwm2_submission_body(
    y_south: float, x_west: float, y_north: float, x_east: float, username: str, workflow_name: str
):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "nwm2-subset-minio",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [
                f"output-bucket={username}",
                f"output-path=argo_workflows/nwm2/{workflow_name}",
                f"y_south={y_south}",
                f"x_west={x_west}",
                f"y_north={y_north}",
                f"x_east={x_east}",
            ],
        },
    }


def metadata_extraction_submission_body(bucket_key: str, path_key: str, workflow_name: str):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "metadata-extractor",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [
                f"job-id={workflow_name}",
                f"bucket={bucket_key}",
                f"path={path_key}",
            ],
        },
    }


@router.post('/submit/parflow')
async def submit_parflow(
    hucs: Annotated[list[str] | None, Query()], user: User = Depends(current_active_user)
) -> SubmissionResponseModel:
    workflow_id = str(uuid.uuid4())
    api_response = api_instance.submit_workflow(
        namespace=get_settings().argo_namespace,
        body=parflow_submission_body(hucs, user.username, workflow_id),
        _preload_content=False,
    )
    log.info(api_response.json())
    submission = Submission(workflow_id=workflow_id, workflow_name="parflow")
    return await upsert_submission(user, submission)


@router.post('/submit/nwm1')
async def submit_nwm1(
    y_south: float, x_west: float, y_north: float, x_east: float, user: User = Depends(current_active_user)
) -> SubmissionResponseModel:
    # y_south, x_west, y_north, x_east = transform_latlon(y_south, x_west, y_north, x_east)
    workflow_id = str(uuid.uuid4())
    api_response = api_instance.submit_workflow(
        namespace=get_settings().argo_namespace,
        body=nwm1_submission_body(y_south, x_west, y_north, x_east, user.username, workflow_id),
        _preload_content=False,
    )
    log.info(api_response.json())
    submission = Submission(workflow_id=workflow_id, workflow_name="nwm1")
    return await upsert_submission(user, submission)


@router.post('/submit/nwm2')
async def submit_nwm2(
    y_south: float, x_west: float, y_north: float, x_east: float, user: User = Depends(current_active_user)
) -> SubmissionResponseModel:
    # y_south, x_west, y_north, x_east = transform_latlon(y_south, x_west, y_north, x_east)
    workflow_id = str(uuid.uuid4())
    api_response = api_instance.submit_workflow(
        namespace=get_settings().argo_namespace,
        body=nwm2_submission_body(y_south, x_west, y_north, x_east, user.username, workflow_id),
        _preload_content=False,
    )
    log.info(api_response.json())
    submission = Submission(workflow_id=workflow_id, workflow_name="nwm2")
    return await upsert_submission(user, submission)


async def upsert_submission(user: User, submission: Submission) -> Submission:
    api_response = api_instance.get_workflow(
        namespace=get_settings().argo_namespace, name=submission.workflow_id, _preload_content=False
    )
    log.info(api_response.json())
    status_json = api_response.json()["status"]
    if "phase" in status_json:
        submission.phase = status_json["phase"]
    if "estimatedDuration" in status_json:
        submission.estimatedDuration = status_json["estimatedDuration"]
    submission.startedAt = status_json["startedAt"]
    submission.finishedAt = status_json["finishedAt"]
    await user.update_submission(submission)
    return submission


@router.get('/refresh/{workflow_id}')
async def refresh_workflow(workflow_params: WorkflowDep):
    submission = workflow_params.user.get_submission(workflow_params.workflow_id)
    await upsert_submission(workflow_params.user, submission)
    return submission


@router.get('/refresh')
async def refresh_workflow(user: User = Depends(current_active_user)):
    submissions = user.running_submissions()
    for submission in submissions:
        await upsert_submission(user, submission)
    return submissions


'''
    "phase": "Succeeded",
    "startedAt": "2023-10-17T16:26:01Z",
    "finishedAt": "2023-10-17T16:27:35Z",
    "estimatedDuration": 97,
    "progress": "2/2",
'''


def parse_logs(api_response):
    logs = ""
    for l in api_response.read().decode("utf-8").splitlines():
        x = l.replace('\\"', '\\\"')
        l_json = json.loads(x)
        logs = logs + (l_json["result"]["content"])
    return logs


@router.get('/logs/{workflow_id}', description="logs for a workflow")
async def logs(workflow_params: WorkflowDep) -> LogsResponseModel:
    submission = workflow_params.user.get_submission(workflow_params.workflow_id)
    api_response = api_instance.workflow_logs(
        namespace=get_settings().argo_namespace,
        name=submission.workflow_id,
        _check_return_type=True,
        log_options_insecure_skip_tls_verify_backend=True,
        _check_input_type=True,
        log_options_container="main",
        _preload_content=False,
    )
    log.info(api_response.json())
    return {"logs": parse_logs(api_response)}


@router.get('/url/{workflow_id}', description="Create a download url")
async def signed_url_minio(workflow_params: WorkflowDep) -> UrlResponseModel:
    submission = workflow_params.user.get_submission(workflow_params.workflow_id)
    url = get_minio_client().presigned_get_object(
        "subsetter-outputs",
        f"{workflow_params.user.username}/{submission.workflow_name}/{submission.workflow_id}/all.gz",
    )
    return {'url': url}


@router.get('/argo/{workflow_id}')
async def argo_metadata(workflow_params: WorkflowDep):
    api_response = api_instance.get_workflow(
        namespace=get_settings().argo_namespace, name=workflow_params.workflow_id, _preload_content=False
    )
    log.info(api_response.json())
    return {"metadata": api_response.json()["metadata"], "status": api_response.json()["status"]}


@router.get('/submissions')
async def submissions(user: User = Depends(current_active_user)) -> UserSubmissionsResponseModel:
    return {"submissions": user.submissions}
