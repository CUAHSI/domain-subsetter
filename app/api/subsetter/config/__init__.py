from functools import lru_cache

from dotenv import load_dotenv
from minio import Minio
from pydantic_settings import BaseSettings

# had to use load_dotenv() to get the env variables to work during testing
load_dotenv()


class Settings(BaseSettings):
    argo_host: str
    argo_namespace: str
    argo_bearer_token: str

    mongo_url: str
    mongo_database: str

    oauth2_client_id: str
    oauth2_client_secret: str
    oauth2_redirect_url: str
    vite_oauth2_redirect_url: str
    allow_origins: str

    minio_access_key: str
    minio_secret_key: str
    minio_api_url: str

    cloud_run: bool = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()


@lru_cache()
def get_minio_client() -> Minio:
    return Minio(
        get_settings().minio_api_url,
        access_key=get_settings().minio_access_key,
        secret_key=get_settings().minio_secret_key,
    )
