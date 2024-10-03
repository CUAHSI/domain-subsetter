from typing import Annotated, Any
from enum import Enum

from fastapi import Depends, HTTPException, Path, status
from pydantic import BaseModel, Field

from app.db import Submission, User
from app.users import current_active_user


class WorkflowParams(BaseModel):
    workflow_id: str = Field(title="Workflow ID", description="The id of the workflow")
    submission: Submission
    user: User


async def workflow_params(
    workflow_id: Annotated[str, Path(title="Workflow ID", description="The id of the workflow")],
    user: User = Depends(current_active_user),
):
    submission = user.get_submission(workflow_id)
    if workflow_id not in [submission.workflow_id for submission in user.submissions]:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return WorkflowParams(workflow_id=workflow_id, user=user, submission=submission)


WorkflowDep = Annotated[WorkflowParams, Depends(workflow_params)]


class LogsResponseModel(BaseModel):
    logs: str = Field(description="The logs for a workflow submission")


class UrlResponseModel(BaseModel):
    url: str = Field(description="The presigned url to download a submission result")


class UserSubmissionsResponseModel(BaseModel):
    submissions: list[Submission]


class SubmissionResponseModel(Submission):
    workflow_id: str

class NWMVersionEnum(str, Enum):
    nwm1 = "nwm1"
    nwm2 = "nwm2"
    nwm3 = "nwm3"

class ExtractMetadataRequestBody(BaseModel):
    workflow_id: str
    metadata: Any = None
