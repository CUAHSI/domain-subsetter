from typing import Annotated

from app.db import User, WorkflowSubmission
from app.users import current_active_user
from fastapi import Depends, HTTPException, Path, status
from pydantic import BaseModel, Field


class WorkflowParams(BaseModel):
    workflow_id: str = Field(title="Workflow ID", description="The id of the workflow")


async def workflow_params(
    workflow_id: Annotated[str, Path(title="Workflow ID", description="The id of the workflow")],
    workflow_submission: WorkflowSubmission,
    user: User = Depends(current_active_user),
):
    workflow_submission = user.get_submission(workflow_id)
    if not workflow_submission:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return WorkflowParams(workflow_id=workflow_id, user=user, workflow_submission=workflow_submission)


WorkflowDep = Annotated[WorkflowParams, Depends(workflow_params)]


class LogsResponseModel(BaseModel):
    logs: str = Field(description="The logs for a workflow submission")


class UrlResponseModel(BaseModel):
    url: str = Field(description="The presigned url to download a submission result")


class UserSubmissionsResponseModel(BaseModel):
    submissions: list[WorkflowSubmission]


class WorkflowSubmissionResponseModel(WorkflowSubmission):
    workflow_id: str
