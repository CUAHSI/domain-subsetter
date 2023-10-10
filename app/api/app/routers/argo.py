from typing import Annotated
from api.app.db import User
from api.config import get_settings
from fastapi import APIRouter, Depends, Query
import json

import argo_workflows
from argo_workflows.api import workflow_service_api
from app.users import current_active_user
from minio import Minio

import uuid

router = APIRouter()

NAMESPACE='workflows'

configuration = argo_workflows.Configuration(host=get_settings().argo_host)
configuration.api_key['BearerToken'] = get_settings().argo_bearer_token

api_client = argo_workflows.ApiClient(configuration)
api_instance = workflow_service_api.WorkflowServiceApi(api_client)


client = Minio(get_settings().minio_api_url, access_key=get_settings().minio_access_key, secret_key=get_settings().minio_secret_key)

def parameters(hucs: list, workflow_name = str(uuid.uuid4())):
    template_name = "parflow-subset-v1-by-huc-minio"
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": template_name,
        "submitOptions": {
            "name": workflow_name,
            "parameters":[f"job-id={workflow_name}", "hucs=" + ",".join(hucs)],
        }
    }


@router.get('/submit')
async def submit(hucs: Annotated[list[str] | None, Query()], user: User = Depends(current_active_user)):
    workflows_name = str(uuid.uuid4())
    api_instance.submit_workflow(namespace=get_settings().argo_namespace, body=parameters(hucs, workflows_name), _preload_content=False)
    user.workflow_submissions.append(workflows_name)
    await user.save()
    return workflows_name

def parse_logs(api_response):
    logs = ""
    for l in api_response.read().decode("utf-8").splitlines():
        x = l.replace('\\"', '\\\"')
        l_json = json.loads(x)
        logs = logs + (l_json["result"]["content"])
    return logs

@router.get('/logs')
async def logs(workflow_name: str, user: User = Depends(current_active_user)):
    api_response = api_instance.workflow_logs(namespace=get_settings().argo_namespace, name=workflow_name, _check_return_type=True, 
                                              log_options_insecure_skip_tls_verify_backend=True, _check_input_type=True,
                                              log_options_container="main", _preload_content=False)
    return parse_logs(api_response)

@router.get('/url')
async def signed_url_minio(workflow_name: str, user: User = Depends(current_active_user)):
    url = client.presigned_get_object("subsetter-outputs", f"parflow/{workflow_name}/subset")
    return url

@router.get('/submissions')
async def submissions(user: User = Depends(current_active_user)):
    return user.workflow_submissions