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
    users = await User.find({"submissions.view_users": user.username}).to_list()
    # this should be rewritten to query all on the db, but I don't have time to figure that out now
    matching_submissions = []
    for u in users:
        for submission in u.submissions:
            if user.username in submission.view_users:
                matching_submissions.append((u, submission))
    return minio_policy(user, matching_submissions)


@router.get('/profile')
async def refresh_profile(user: User = Depends(current_active_user)):
    await user.update_profile()
    return user


import json
import os
import subprocess
import tempfile


def admin_policy_create(name, policy, target="cuahsi"):
    with tempfile.TemporaryDirectory() as tmpdirname:
        print(policy)
        filepath = os.path.join(tmpdirname, "metadata.json")
        fp = open(filepath, "w")
        fp.write(json.dumps(policy))
        fp.close()
        arguments = ['mc', '--json', 'admin', 'policy', 'create', target, name, filepath]
        try:
            _output = subprocess.check_output(arguments)
        except subprocess.CalledProcessError as e:
            raise


@router.get('/policy/minio/cuahsi')
async def generate_and_save_user_policy(user: User = Depends(current_active_user)):
    user_policy = await generate_user_policy(user)
    admin_policy_create(user.username, user_policy)
    return user_policy
