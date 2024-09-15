import json
import tempfile
from typing import Any, Union

import google.cloud.logging as logging
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.db import User
from app.users import current_active_user
from config import get_minio_client, get_settings

if get_settings().cloud_run:
    logging_client = logging.Client()
    logging_client.setup_logging()

router = APIRouter()


class HydroShareMetadata(BaseModel):
    title: str
    description: str


class DatasetMetadataRequestModel(BaseModel):
    file_path: str
    # bucket_name: str
    metadata: Union[HydroShareMetadata, Any]


@router.post('/dataset/metadata')
async def create_metadata(metadata_request: DatasetMetadataRequestModel, user: User = Depends(current_active_user)):
    with tempfile.NamedTemporaryFile(delete=False) as fp:
        metadata_json_str = json.dumps(metadata_request.metadata)
        print(metadata_json_str)
        fp.write(str.encode(metadata_json_str))
        fp.close()
        get_minio_client().fput_object(user.bucket_name, metadata_request.file_path, fp.name)


@router.put('/dataset/metadata')
async def update_metadata(metadata_request: DatasetMetadataRequestModel, user: User = Depends(current_active_user)):
    get_minio_client().remove_object(user.bucket_name, metadata_request.file_path)
    return await create_metadata(metadata_request, user)


class DatasetExtractRequestModel(BaseModel):
    file_path: str = None
    # bucket_name: str
    metadata: Union[HydroShareMetadata, Any] = None
