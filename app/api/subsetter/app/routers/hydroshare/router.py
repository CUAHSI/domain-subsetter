import json
import tempfile
from typing import Any, Union

import argo_workflows
import google.cloud.logging as logging
from argo_workflows.api import workflow_service_api
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from subsetter.app.db import User
from subsetter.app.routers.utils import metadata_file_path, minio_client
from subsetter.app.users import current_active_user
from subsetter.config import get_settings

if get_settings().cloud_run:
    logging_client = logging.Client()
    logging_client.setup_logging()

router = APIRouter()


class HydroShareMetadata(BaseModel):
    title: str
    description: str


class DatasetMetadataRequestModel(BaseModel):
    file_path: str
    bucket_name: str = None
    metadata: Union[HydroShareMetadata, Any]


class DatasetMetadataDeleteModel(BaseModel):
    file_path: str
    bucket_name: str = None


@router.post('/dataset/metadata')
async def create_metadata(metadata_request: DatasetMetadataRequestModel, user: User = Depends(current_active_user)):
    if metadata_request.bucket_name is None:
        metadata_request.bucket_name = user.bucket_name
    with tempfile.NamedTemporaryFile(delete=False) as fp:
        metadata_json_str = json.dumps(metadata_request.metadata)
        print(metadata_json_str)
        fp.write(str.encode(metadata_json_str))
        fp.close()
        minio_client(user).fput_object(metadata_request.bucket_name, metadata_request.file_path, fp.name)


@router.put('/dataset/metadata')
async def update_metadata(metadata_request: DatasetMetadataRequestModel, user: User = Depends(current_active_user)):
    minio_client(user).remove_object(user.bucket_name, metadata_request.file_path)
    return await create_metadata(metadata_request, user)


@router.delete('/dataset/metadata')
async def delete_metadata(metadata_request: DatasetMetadataDeleteModel, user: User = Depends(current_active_user)):
    minio_client(user).remove_object(user.bucket_name, metadata_request.file_path)


class DatasetExtractRequestModel(BaseModel):
    file_path: str = None
    bucket_name: str


NAMESPACE = 'workflows'

configuration = argo_workflows.Configuration(host=get_settings().argo_host)
configuration.api_key['BearerToken'] = get_settings().argo_bearer_token

api_client = argo_workflows.ApiClient(configuration)
api_instance = workflow_service_api.WorkflowServiceApi(api_client)


def submission_body(bucket: str, input_path: str, output_path: str, base_url: str) -> dict:
    return {
        "resourceKind": "WorkflowTemplate",
        "resourceName": "metadata-extractor-path",
        "submitOptions": {
            "parameters": [
                f"bucket={bucket}",
                f"input-path={input_path}",
                f"output-path={output_path}",
                f"base-url={base_url}",
            ],
        },
    }


@router.post('/dataset/extract')
async def dataset_extract(extract_request: DatasetExtractRequestModel, user: User = Depends(current_active_user)):
    api_response = api_instance.submit_workflow(
        namespace=get_settings().argo_namespace,
        body=submission_body(
            extract_request.bucket_name,
            extract_request.file_path,
            metadata_file_path(extract_request.file_path),
            f"https://www.hydroshare.org/s3/{extract_request.bucket_name}/{extract_request.file_path}/",
        ),
        _preload_content=False,
    )
    return api_response.json()
