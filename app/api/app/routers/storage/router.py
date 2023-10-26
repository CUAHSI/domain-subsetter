import json
from typing import Annotated

from app.users import current_active_user
from fastapi import APIRouter, Depends, Query

from api.app.db import User, WorkflowSubmission

# from .policy_generation import minio_policy
from api.app.models import WorkflowDep

router = APIRouter()

'''
@router.get('/add/{user_name}/workflow/{workflow_id}')
async def share_workflow_with_user(user_name: str, workflow_params: WorkflowDep, user: User = Depends(current_active_user)):
    workflow_submission: WorkflowSubmission = workflow_params.workflow_submission
    workflow_submission.add_user(user_name)
    await user.update_submission(workflow_submission)
    return User.get(user.document_id)

@router.get('/remove/{user_name}/workflow/{workflow_id}')
async def share_workflow_with_user(user_name: str, workflow_params: WorkflowDep, user: User = Depends(current_active_user)):
    workflow_submission: WorkflowSubmission = workflow_params.workflow_submission
    workflow_submission.remove_user(user_name)
    await user.update_submission(workflow_submission)
    return User.get(document_id=user.document_id)
'''
