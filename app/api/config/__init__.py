from functools import lru_cache

from dotenv import load_dotenv
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

    minio_access_key: str
    minio_secret_key: str
    minio_api_url: str

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
