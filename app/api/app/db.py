import os
from typing import List

import motor.motor_asyncio
from beanie import Document
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser, BeanieUserDatabase
from pydantic import Field

DATABASE_URL = os.getenv("MONGO_URL")
client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL, uuidRepresentation="standard")
db = client[os.getenv("MONGO_DATABASE")]


class OAuthAccount(BaseOAuthAccount):
    pass


class User(BeanieBaseUser, Document):
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    workflow_submissions: List[str] = Field(default_factory=list)


async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)
