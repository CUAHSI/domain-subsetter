import json
import uuid
from typing import Annotated

import argo_workflows
from app.users import current_active_user
from argo_workflows.api import workflow_service_api
from fastapi import APIRouter, Depends, Query

from api.app.db import User
from api.config import get_minio_client, get_settings

from .models import (
    LogsResponseModel,
    UrlResponseModel,
    UserSubmissionsResponseModel,
    WorkflowDep,
    WorkflowSubmissionResponseModel,
)

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
            "parameters": [f"job-id={workflow_name}", f"bbox1={bbox1}", f"bbox2={bbox2}", f"bbox3={bbox3}", f"bbox4={bbox4}", ],
        },
    }

def nwm2_submission_body(bbox1: float, bbox2: float, bbox3: float, bbox4: float, workflow_name: str):
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "nwm2-subset-minio",
        "submitOptions": {
            "name": workflow_name,
            "parameters": [f"job-id={workflow_name}", f"bbox1={bbox1}", f"bbox2={bbox2}", f"bbox3={bbox3}", f"bbox4={bbox4}", ],
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
    user.workflow_submissions.append({"workflow_id": workflow_id})
    await user.save()
    return {"workflow_id": workflow_id}


@router.post('/submit/nwm1')
async def submit_nwm1(
    bbox1: float, bbox2: float, bbox3: float, bbox4: float, user: User = Depends(current_active_user)
) -> WorkflowSubmissionResponseModel:
    workflow_id = str(uuid.uuid4())
    api_instance.submit_workflow(
        namespace=get_settings().argo_namespace, body=nwm1_submission_body(bbox1, bbox2, bbox3, bbox4, workflow_id), _preload_content=False
    )
    user.workflow_submissions.append({"workflow_id": workflow_id})
    await user.save()
    return {"workflow_id": workflow_id}


@router.post('/submit/nwm2')
async def submit_nwm2(
    bbox1: float, bbox2: float, bbox3: float, bbox4: float, user: User = Depends(current_active_user)
) -> WorkflowSubmissionResponseModel:
    workflow_id = str(uuid.uuid4())
    api_instance.submit_workflow(
        namespace=get_settings().argo_namespace, body=nwm2_submission_body(bbox1, bbox2, bbox3, bbox4, workflow_id), _preload_content=False
    )
    user.workflow_submissions.append({"workflow_id": workflow_id})
    await user.save()
    return {"workflow_id": workflow_id}


def parse_logs(api_response):
    logs = ""
    for l in api_response.read().decode("utf-8").splitlines():
        x = l.replace('\\"', '\\\"')
        l_json = json.loads(x)
        logs = logs + (l_json["result"]["content"])
    return logs


@router.get('/logs/{workflow_id}', description="logs for a workflow")
async def logs(workflow_params: WorkflowDep) -> LogsResponseModel:
    api_response = api_instance.workflow_logs(
        namespace=get_settings().argo_namespace,
        name=workflow_params.workflow_id,
        _check_return_type=True,
        log_options_insecure_skip_tls_verify_backend=True,
        _check_input_type=True,
        log_options_container="main",
        _preload_content=False,
    )
    return {"logs": parse_logs(api_response)}


@router.get('/url/{workflow_id}', description="Create a download url")
async def signed_url_minio(workflow_params: WorkflowDep) -> UrlResponseModel:
    url = get_minio_client().presigned_get_object("subsetter-outputs", f"parflow/{workflow_params.workflow_id}/subset")
    return {'url': url}


@router.get('/submissions')
async def submissions(user: User = Depends(current_active_user)) -> UserSubmissionsResponseModel:
    return {"submissions": user.workflow_submissions}
