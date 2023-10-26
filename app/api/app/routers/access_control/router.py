import json
from typing import Annotated

from app.users import current_active_user
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from api.app.db import User, WorkflowSubmission
from api.app.models import WorkflowDep

from .policy_generation import minio_policy

router = APIRouter()


class ShareWorkflowBody(BaseModel):
    username: str
    workflow_id: str


@router.post('/policy/add')
async def share_workflow_with_user(share_params: ShareWorkflowBody, user: User = Depends(current_active_user)):
    workflow_submission: WorkflowSubmission = user.get_submission(share_params.workflow_id)
    if workflow_submission:
        workflow_submission.add_user(share_params.username)
        await user.update_submission(workflow_submission)
        return user
    else:
        return HTTPException(status_code=400)


@router.delete('/policy/remove')
async def unshare_workflow_with_user(share_params: ShareWorkflowBody, user: User = Depends(current_active_user)):
    workflow_submission: WorkflowSubmission = user.get_submission(share_params.workflow_id)
    if workflow_submission:
        workflow_submission.remove_user(share_params.username)
        await user.update_submission(workflow_submission)
        return user
    else:
        return HTTPException(status_code=400)


# @router.get('/policy')
# async def generate_user_policy(user: User = Depends(current_active_user)):
#    User.find({ "workflow_submissions": { "$elemMatch": {"view_users": {"$elemMatch"{ "$eq": "green" } } } )
