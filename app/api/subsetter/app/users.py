import os
from typing import Any, Dict, Optional, Tuple, cast

import httpx
from beanie import PydanticObjectId
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, CookieTransport, JWTStrategy
from fastapi_users.db import BeanieUserDatabase, ObjectIDIDMixin
from httpx_oauth.errors import GetIdEmailError
from httpx_oauth.oauth2 import OAuth2

from subsetter.app.db import User, get_user_db

SECRET = "SECRET"


class CUAHSIOAuth2(OAuth2):
    async def get_id_email(self, token: str) -> Tuple[str, str]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/userinfo",
                headers={"Authorization": f"Bearer {token}"},
            )

            if response.status_code >= 400:
                raise GetIdEmailError(response.json())

            data = cast(Dict[str, Any], response.json())

            return data["sub"], data["email"]


class FrontOAuth2(CUAHSIOAuth2):
    # https://github.com/frankie567/httpx-oauth/blob/v0.13.0/httpx_oauth/oauth2.py#L131
    async def get_access_token(self, code: str, redirect_uri: str, code_verifier: Optional[str] = None):
        async with self.get_httpx_client() as client:
            data = {
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": f"{os.getenv('VITE_APP_URL')}/auth-redirect",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            }

            if code_verifier:
                data.update({"code_verifier": code_verifier})

            response = await client.post(
                self.access_token_endpoint,
                data=data,
                headers=self.request_headers,
            )

            data = cast(Dict[str, Any], response.json())

            if response.status_code >= 400:
                raise GetAccessTokenError(data)

            return OAuth2Token(data)


client_params = dict(
    client_id=os.getenv("OAUTH2_CLIENT_ID"),
    client_secret=os.getenv("OAUTH2_CLIENT_SECRET"),
    authorize_endpoint="https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/auth",
    access_token_endpoint="https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/token",
    refresh_token_endpoint="https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/token",
    revoke_token_endpoint="https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/revoke",
    base_scopes=["openid"],
)

front_oauth_client = FrontOAuth2(**client_params)
cuahsi_oauth_client = CUAHSIOAuth2(**client_params)


class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        await user.update_profile()
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(self, user: User, token: str, request: Optional[Request] = None):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(self, user: User, token: str, request: Optional[Request] = None):
        print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


cookie_transport = CookieTransport(
    cookie_max_age=60 * 60 * 24 * 30,
    cookie_domain=os.getenv("VITE_APP_API_HOST"),
    cookie_secure=True,
    cookie_httponly=True,
    cookie_samesite="lax",
)
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=60 * 60 * 24 * 30)  # one month


cookie_backend = AuthenticationBackend(
    name="cookie",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](get_user_manager, [cookie_backend, auth_backend])

current_active_user = fastapi_users.current_user(active=True)
