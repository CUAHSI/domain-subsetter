import json
import os
import subprocess
import tempfile
from typing import Dict

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.db import User, get_hydroshare_access_db
from app.routers.access_control.policy_generation import minio_policy
from app.users import current_active_user

from .policy_generation import refresh_minio_policy

router = APIRouter()


class UserAccess(BaseModel):
    owner: list[str]
    edit: list[str]
    view: list[str]


class MinioUserResourceAccess(BaseModel):
    owners: list[str]
    resource_id: str
    minio_resource_url: str


class MinioUserAccess(BaseModel):
    owner: list[MinioUserResourceAccess]
    edit: list[MinioUserResourceAccess]
    view: list[MinioUserResourceAccess]


class UserPrivilege(BaseModel):
    username: str
    all: UserAccess
    minio: MinioUserAccess


def check_owners_in_bucket_path(resource_access: MinioUserResourceAccess):
    for owner in resource_access.owners:
        if f"/browser/{owner}/" in resource_access.minio_resource_url:
            return owner
    return None


def sort_privileges(user_accesses: list[MinioUserResourceAccess]):
    authorized_users = {}
    for user_access in user_accesses:
        bucket_owner = check_owners_in_bucket_path(user_access)
        if bucket_owner:
            resource_path = user_access.minio_resource_url.split(f"{bucket_owner}/", 1)[-1]
            authorized_users.setdefault(bucket_owner, []).append(resource_path)
    return authorized_users


@router.get('/policy')
async def generate_user_policy(user: User = Depends(current_active_user)):
    hydroshare_access_db = get_hydroshare_access_db()
    user_privilege = await hydroshare_access_db.userprivileges.find_one({"username": user.username})
    user_privilege: UserPrivilege = UserPrivilege(**user_privilege)

    # Check Authorization
    minio_user_access: MinioUserAccess = user_privilege.minio
    authorized_owners: Dict[str, list[str]] = sort_privileges(minio_user_access.owner)
    authorized_edits: Dict[str, list[str]] = sort_privileges(minio_user_access.edit)
    authorized_views: Dict[str, list[str]] = sort_privileges(minio_user_access.view)

    return minio_policy(user, authorized_owners, authorized_edits, authorized_views)


@router.get('/profile')
async def refresh_profile(user: User = Depends(current_active_user)):
    await user.update_profile()
    return user


@router.get('/policy/minio/cuahsi')
async def generate_and_save_user_policy(user: User = Depends(current_active_user)):
    user_policy = await generate_user_policy(user)
    return refresh_minio_policy(user, user_policy)
