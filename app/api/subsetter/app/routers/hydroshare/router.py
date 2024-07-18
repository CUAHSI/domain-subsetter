import json
import tempfile
from typing import Any, Union

import google.cloud.logging as logging
from fastapi import APIRouter, Depends
from minio import Minio
from pydantic import BaseModel

from subsetter.app.db import User
from subsetter.app.users import current_active_user
from subsetter.config import get_settings
from subsetter.config.minio import get_minio_client

if get_settings().cloud_run:
    logging_client = logging.Client()
    logging_client.setup_logging()

router = APIRouter()


import subprocess
from datetime import datetime, timedelta


def get_tomorrow_date():
    tomorrow = datetime.now() + timedelta(days=1)
    return tomorrow.strftime("%Y-%m-%d")


def minio_client(user: User):
    process = subprocess.Popen(
        f"mc admin user svcacct add --expiry {get_tomorrow_date()} cuahsi {user.username}",
        stdout=subprocess.PIPE,
        shell=True,
    )
    output, error = process.communicate()

    if error:
        print(f"Error: {error}")
        raise Exception('Error generating access key')
    else:
        output = output.decode("utf-8")
        lines = output.split("\n")
        access_key_line = next(line for line in lines if line.startswith("Access Key:"))
        secret_key_line = next(line for line in lines if line.startswith("Secret Key:"))
        expiration_line = next(line for line in lines if line.startswith("Expiration:"))

        access_key = access_key_line.split(":")[1].strip()
        secret_key = secret_key_line.split(":")[1].strip()
        expiration = expiration_line.split(":")[1].strip()
        minio_client = Minio(get_settings().minio_api_url, access_key=access_key, secret_key=secret_key)
        return minio_client


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
        minio_client(user).fput_object(user.bucket_name, metadata_request.file_path, fp.name)


@router.put('/dataset/metadata')
async def update_metadata(metadata_request: DatasetMetadataRequestModel, user: User = Depends(current_active_user)):
    minio_client(user).remove_object(user.bucket_name, metadata_request.file_path)
    return await create_metadata(metadata_request, user)


class DatasetExtractRequestModel(BaseModel):
    file_path: str = None
    bucket_name: str
    metadata: Union[HydroShareMetadata, Any] = None
