import os
from typing import Any, Dict, Optional, cast

from beanie import PydanticObjectId
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import BeanieUserDatabase, ObjectIDIDMixin
from httpx_oauth.oauth2 import OAuth2

from app.db import User, get_user_db

SECRET = "SECRET"

from typing import Any, Dict, Tuple, cast

import httpx
from httpx_oauth.errors import GetIdEmailError
from httpx_oauth.oauth2 import OAuth2


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

cuahsi_oauth_client = CUAHSIOAuth2(
    os.getenv("OAUTH2_CLIENT_ID"),
    os.getenv("OAUTH2_CLIENT_SECRET"),
    "https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/auth",
    "https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/token",
    refresh_token_endpoint="https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/token",
    revoke_token_endpoint="https://auth.cuahsi.io/realms/CUAHSI/protocol/openid-connect/revoke",
    base_scopes=["openid"]
)


class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=60*60*24*30) # one month


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)