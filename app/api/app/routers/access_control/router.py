import json
from typing import Annotated

from app.db import Submission, User
from app.models import WorkflowDep
from app.users import current_active_user
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from .policy_generation import minio_policy

router = APIRouter()


class ShareWorkflowBody(BaseModel):
    username: str
    workflow_id: str


@router.post('/policy/add')
async def share_workflow_with_user(share_params: ShareWorkflowBody, user: User = Depends(current_active_user)):
    submission: Submission = user.get_submission(share_params.workflow_id)
    if submission:
        submission.add_user(share_params.username)
        await user.update_submission(submission)
        return user
    else:
        return HTTPException(status_code=400)


@router.delete('/policy/remove')
async def unshare_workflow_with_user(share_params: ShareWorkflowBody, user: User = Depends(current_active_user)):
    submission: Submission = user.get_submission(share_params.workflow_id)
    if submission:
        submission.remove_user(share_params.username)
        await user.update_submission(submission)
        return user
    else:
        return HTTPException(status_code=400)


@router.get('/policy')
async def generate_user_policy(user: User = Depends(current_active_user)):
    users = await User.find({"submissions.view_users": user.email}).to_list()
    # this should be rewritten to query all on the db, but I don't have time to figure that out now
    matching_submissions = []
    for u in users:
        for submission in u.submissions:
            if user.email in submission.view_users:
                matching_submissions.append(submission)
    return minio_policy(matching_submissions)
