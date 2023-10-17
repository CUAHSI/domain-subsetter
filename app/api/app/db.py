import os
from enum import Enum
from typing import List, Optional

import motor.motor_asyncio
from beanie import Document
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser, BeanieUserDatabase
from pydantic import BaseModel, Field

DATABASE_URL = os.getenv("MONGO_URL")
client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL, uuidRepresentation="standard")
db = client[os.getenv("MONGO_DATABASE")]


class OAuthAccount(BaseOAuthAccount):
    pass


class PhaseEnum(str, Enum):
    RUNNING = "Running"
    SUCCEEDED = "Succeeded"
    # FAILED = "Failed"
    # PENING = "Pending"


class WorkflowSubmission(BaseModel):
    workflow_id: str
    workflow_name: str
    phase: Optional[PhaseEnum] = None
    startedAt: Optional[str] = None
    finishedAt: Optional[str] = None
    estimatedDuration: Optional[int] = None


class User(BeanieBaseUser, Document):
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    workflow_submissions: List[WorkflowSubmission] = Field(default_factory=list)

    def get_submission(self, workflow_id: str) -> WorkflowSubmission:
        try:
            return next(submission for submission in self.workflow_submissions if submission.workflow_id == workflow_id)
        except:
            return None

    def update_submission(self, submission: WorkflowSubmission) -> None:
        if self.get_submission(submission.workflow_id):
            self.workflow_submissions = [
                submission if submission.workflow_id == ws.workflow_id else ws for ws in self.workflow_submissions
            ]
        else:
            self.workflow_submissions.append(submission)


async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)
