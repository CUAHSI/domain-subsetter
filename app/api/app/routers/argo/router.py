import json
import uuid
from typing import Annotated

import argo_workflows
from app.users import current_active_user
from argo_workflows.api import workflow_service_api
from fastapi import APIRouter, Depends, Query

from api.app.db import User, WorkflowSubmission
from api.app.models import (
    LogsResponseModel,
    UrlResponseModel,
    UserSubmissionsResponseModel,
    WorkflowDep,
    WorkflowSubmissionResponseModel,
)
from api.config import get_minio_client, get_settings

router = APIRouter()

NAMESPACE = 'workflows'

configuration = argo_workflows.Configuration(host=get_settings().argo_host)
configuration.api_key['BearerToken'] = get_settings().argo_bearer_token

api_client = argo_workflows.ApiClient(configuration)
api_instance = workflow_service_api.WorkflowServiceApi(api_client)


def parflow_submission_body(hucs: list, workflow_name):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "parflow-subset-v1-by-huc-minio",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [f"job-id={workflow_name}", "hucs=" + ",".join(hucs)],
        },
    }


def nwm1_submission_body(bbox1: float, bbox2: float, bbox3: float, bbox4: float, workflow_name: str):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "nwm1-subset-minio",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [
                f"job-id={workflow_name}",
                f"bbox1={bbox1}",
                f"bbox2={bbox2}",
                f"bbox3={bbox3}",
                f"bbox4={bbox4}",
            ],
        },
    }


def nwm2_submission_body(bbox1: float, bbox2: float, bbox3: float, bbox4: float, workflow_name: str):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "nwm2-subset-minio",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [
                f"job-id={workflow_name}",
                f"bbox1={bbox1}",
                f"bbox2={bbox2}",
                f"bbox3={bbox3}",
                f"bbox4={bbox4}",
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
) -> WorkflowSubmissionResponseModel:
    workflow_id = str(uuid.uuid4())
    api_instance.submit_workflow(
        namespace=get_settings().argo_namespace, body=parflow_submission_body(hucs, workflow_id), _preload_content=False
    )
    submission = WorkflowSubmission(workflow_id=workflow_id, workflow_name="parflow")
    user.workflow_submissions.append(submission)
    return await upsert_submission(user, submission)


@router.post('/submit/nwm1')
async def submit_nwm1(
    bbox1: float, bbox2: float, bbox3: float, bbox4: float, user: User = Depends(current_active_user)
) -> WorkflowSubmissionResponseModel:
    workflow_id = str(uuid.uuid4())
    api_instance.submit_workflow(
        namespace=get_settings().argo_namespace,
        body=nwm1_submission_body(bbox1, bbox2, bbox3, bbox4, workflow_id),
        _preload_content=False,
    )
    submission = WorkflowSubmission(workflow_id=workflow_id, workflow_name="nwm1")
    return await upsert_submission(user, submission)


@router.post('/submit/nwm2')
async def submit_nwm2(
    bbox1: float, bbox2: float, bbox3: float, bbox4: float, user: User = Depends(current_active_user)
) -> WorkflowSubmissionResponseModel:
    workflow_id = str(uuid.uuid4())
    api_instance.submit_workflow(
        namespace=get_settings().argo_namespace,
        body=nwm2_submission_body(bbox1, bbox2, bbox3, bbox4, workflow_id),
        _preload_content=False,
    )
    submission = WorkflowSubmission(workflow_id=workflow_id, workflow_name="nwm2")
    return await upsert_submission(user, submission)


@router.post('/extract/{workflow_id}')
async def extract_workflow_artifact(
    workflow_params: WorkflowDep, user: User = Depends(current_active_user)
) -> WorkflowSubmissionResponseModel:
    workflow_id = str(uuid.uuid4())
    bucket = "subsetter-outputs"
    submission = user.get_submission(workflow_params.workflow_id)
    path_key = f'{submission.workflow_name}/{submission.workflow_id}/subset.gz'
    api_instance.submit_workflow(
        namespace=get_settings().argo_namespace,
        body=metadata_extraction_submission_body(bucket, path_key, workflow_id),
        _preload_content=False,
    )
    submission = WorkflowSubmission(workflow_id=workflow_id, workflow_name="extractMD")
    return await upsert_submission(user, submission)


async def upsert_submission(user: User, submission: WorkflowSubmission) -> WorkflowSubmission:
    api_response = api_instance.get_workflow(
        namespace=get_settings().argo_namespace, name=submission.workflow_id, _preload_content=False
    )
    status_json = api_response.json()["status"]
    submission.phase = status_json["phase"]
    submission.startedAt = status_json["startedAt"]
    submission.finishedAt = status_json["finishedAt"]
    submission.estimatedDuration = status_json["estimatedDuration"]
    user.update_submission(submission)
    await user.save()
    return submission


@router.get('/refresh/{workflow_id}')
async def refresh_workflow(workflow_params: WorkflowDep, user: User = Depends(current_active_user)):
    submission = user.get_submission(workflow_params.workflow_id)
    await upsert_submission(user, submission)
    return submission


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
async def logs(workflow_params: WorkflowDep, user: User = Depends(current_active_user)) -> LogsResponseModel:
    submission = user.get_submission(workflow_params.workflow_id)
    api_response = api_instance.workflow_logs(
        namespace=get_settings().argo_namespace,
        name=submission.workflow_id,
        _check_return_type=True,
        log_options_insecure_skip_tls_verify_backend=True,
        _check_input_type=True,
        log_options_container="main",
        _preload_content=False,
    )
    return {"logs": parse_logs(api_response)}


@router.get('/url/{workflow_id}', description="Create a download url")
async def signed_url_minio(workflow_params: WorkflowDep, user: User = Depends(current_active_user)) -> UrlResponseModel:
    submission = user.get_submission(workflow_params.workflow_id)
    url = get_minio_client().presigned_get_object(
        "subsetter-outputs", f"{submission.workflow_name}/{submission.workflow_id}/all.gz"
    )
    return {'url': url}


@router.get('/argo/{workflow_id}')
async def argo_metadata(workflow_params: WorkflowDep, user: User = Depends(current_active_user)):
    api_response = api_instance.get_workflow(
        namespace=get_settings().argo_namespace, name=workflow_params.workflow_id, _preload_content=False
    )
    return {"metadata": api_response.json()["metadata"], "status": api_response.json()["status"]}


@router.get('/submissions')
async def submissions(user: User = Depends(current_active_user)) -> UserSubmissionsResponseModel:
    return {"submissions": user.workflow_submissions}
