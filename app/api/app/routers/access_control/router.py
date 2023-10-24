import json
from typing import Annotated

from fastapi import APIRouter
from .policy_generation import minio_policy


router = APIRouter()


@router.get('/access_control/policy/{user_name}')
async def refresh_workflow(user_name: str):
    return minio_policy(user_name)

