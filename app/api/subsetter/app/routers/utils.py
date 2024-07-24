import subprocess
from datetime import datetime, timedelta

from minio import Minio

from subsetter.app.db import User
from subsetter.config import get_settings


def metadata_file_path(file_path: str) -> str:
    return file_path + "/metadata.gz"


def get_tomorrow_date():
    tomorrow = datetime.now() + timedelta(days=1)
    return tomorrow.strftime("%Y-%m-%d")


def minio_client(user: User) -> Minio:
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

        access_key = access_key_line.split(":")[1].strip()
        secret_key = secret_key_line.split(":")[1].strip()
        minio_client = Minio(get_settings().minio_api_url, access_key=access_key, secret_key=secret_key)
        return minio_client
