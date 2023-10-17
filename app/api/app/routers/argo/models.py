from typing import Annotated

from app.db import User, WorkflowSubmission
from app.users import current_active_user
from fastapi import Depends, HTTPException, Path, status
from pydantic import BaseModel, Field


class WorkflowParams(BaseModel):
    workflow_id: str = Field(title="Workflow ID", description="The id of the workflow")
    user: User


async def workflow_params(
    workflow_id: Annotated[str, Path(title="Workflow ID", description="The id of the workflow")],
    user: User = Depends(current_active_user),
):
    if workflow_id not in [submission.workflow_id for submission in user.workflow_submissions]:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return WorkflowParams(workflow_id=workflow_id, user=user)


WorkflowDep = Annotated[WorkflowParams, Depends(workflow_params)]


class LogsResponseModel(BaseModel):
    logs: str = Field(description="The logs for a workflow submission")


class UrlResponseModel(BaseModel):
    url: str = Field(description="The presigned url to download a submission result")


class UserSubmissionsResponseModel(BaseModel):
    submissions: list[WorkflowSubmission]


class WorkflowSubmissionResponseModel(BaseModel):
    workflow_id: str
