import json
import tempfile
from typing import Union, Any
from pydantic import BaseModel

import google.cloud.logging as logging
from fastapi import APIRouter, Depends

from subsetter.app.db import User
from subsetter.app.users import current_active_user
from subsetter.config import get_settings
from subsetter.config.minio import get_minio_client


if get_settings().cloud_run:
    logging_client = logging.Client()
    logging_client.setup_logging()

router = APIRouter()


import subprocess
from datetime import datetime

tomorow_timestamp = lambda: int(datetime.now().timestamp()) + 86400

def generate_access_key(user: User):
    process = subprocess.Popen(f"mc admin user svcacct ls cuahsi {user.username} --expiry {tomorow_timestamp()}", stdout=subprocess.PIPE, shell=True)
    output, error = process.communicate()

    if error:
        print(f"Error: {error}")
    else:
        print(output)

class HydroShareMetadata(BaseModel):
    title: str
    description: str

class DatasetMetadataRequestModel(BaseModel):
    file_path: str
    bucket_name: str
    metadata: Union[HydroShareMetadata, Any]

@router.post('/dataset/metadata')
async def create_metadata(metadata_request: DatasetMetadataRequestModel, user: User = Depends(current_active_user)):
    with tempfile.NamedTemporaryFile(delete=False) as fp:
        metadata_json_str = json.dumps(metadata_request.metadata)
        print(metadata_json_str)
        fp.write(str.encode(metadata_json_str))
        fp.close()
        get_minio_client(user).fput_object(
            user.bucket_name, metadata_request.file_path, fp.name
        )


@router.put('/dataset/metadata')
async def update_metadata(metadata_request: DatasetMetadataRequestModel, user: User = Depends(current_active_user)):
    get_minio_client().remove_object(user.bucket_name, metadata_request.file_path)
    return await create_metadata(metadata_request, user)


@router.post


class DatasetExtractRequestModel(BaseModel):
    file_path: str = None
    #bucket_name: str
    metadata: Union[HydroShareMetadata, Any] = None
