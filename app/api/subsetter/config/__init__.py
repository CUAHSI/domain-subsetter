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

    hydroshare_mongo_url: str
    hydroshare_mongo_database: str

    oauth2_client_id: str
    oauth2_client_secret: str
    oauth2_redirect_url: str
    vite_oauth2_redirect_url: str
    vite_app_api_url: str
    allow_origins: str

    minio_access_key: str
    minio_secret_key: str
    minio_api_url: str

    cloud_run: bool = False

    OIDC_BASE_URL: str

    @property
    def user_info_endpoint(self):
        return self.OIDC_BASE_URL + "userinfo"

    @property
    def authorize_endpoint(self):
        return self.OIDC_BASE_URL + "auth"

    @property
    def access_token_endpoint(self):
        return self.OIDC_BASE_URL + "token"

    @property
    def refresh_token_endpoint(self):
        # TODO look up refresh token endpoint
        return self.OIDC_BASE_URL + "token"

    @property
    def revoke_token_endpoint(self):
        return self.OIDC_BASE_URL + "revoke"


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
