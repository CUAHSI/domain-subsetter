import re
from enum import Enum
from functools import lru_cache
from typing import List, Optional, Tuple

import httpx
import motor.motor_asyncio
from beanie import Document
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser, BeanieUserDatabase
from pydantic import BaseModel, Field

from config import get_settings

client = motor.motor_asyncio.AsyncIOMotorClient(get_settings().mongo_url, uuidRepresentation="standard")
db = client[get_settings().mongo_database]

client_hydroshare = motor.motor_asyncio.AsyncIOMotorClient(
    get_settings().hydroshare_mongo_url, uuidRepresentation="standard"
)
db_hydroshare = client_hydroshare[get_settings().hydroshare_mongo_database]


class OAuthAccount(BaseOAuthAccount):
    pass


class PhaseEnum(str, Enum):
    RUNNING = "Running"
    SUCCEEDED = "Succeeded"
    FAILED = "Failed"
    PENDING = "Pending"
    ERROR = "Error"


class Submission(BaseModel):
    workflow_id: str
    workflow_name: str
    phase: Optional[PhaseEnum] = None
    startedAt: Optional[str] = None
    finishedAt: Optional[str] = None
    estimatedDuration: Optional[int] = None

    def output_path(self, base_path):
        return f"{base_path}/{self.workflow_name}/{self.workflow_id}"


class User(BeanieBaseUser, Document):
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    submissions: List[Submission] = Field(default_factory=list)
    name: Optional[str] = None
    username: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None

    @property
    def bucket_name(self):
        return re.sub("[^A-Za-z0-9\.-]", "", re.sub("[@]", ".at.", self.username.lower()))

    async def update_profile(self):
        async def get_profile(token: str) -> Tuple[str, str]:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    get_settings().user_info_endpoint,
                    headers={"Authorization": f"Bearer {token}"},
                )
                return response.json()

        profile = await get_profile(self.oauth_accounts[0].access_token)
        self.name = profile['name']
        self.username = profile['preferred_username']
        self.given_name = profile['given_name']
        self.family_name = profile['family_name']
        await self.save()

    def get_submission(self, workflow_id: str) -> Submission:
        try:
            return next(submission for submission in self.submissions if submission.workflow_id == workflow_id)
        except:
            return None

    def running_submissions(self) -> list[Submission]:
        return [submission for submission in self.submissions if submission.phase == PhaseEnum.RUNNING]

    async def update_submission(self, submission: Submission) -> None:
        if self.get_submission(submission.workflow_id):
            self.submissions = [
                submission if submission.workflow_id == ws.workflow_id else ws for ws in self.submissions
            ]
        else:
            self.submissions.append(submission)
        await self.save()


async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)


@lru_cache
def get_hydroshare_access_db():
    return db_hydroshare
