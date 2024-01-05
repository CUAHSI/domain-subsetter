from fastapi import APIRouter, Depends

from subsetter.app.db import Submission, User
from subsetter.app.models import WorkflowDep
from subsetter.app.users import current_active_user
from subsetter.config import get_minio_client

router = APIRouter()


@router.get('/presigned/put', description="Create a download url")
async def presigned_put_minio(workflow_params: WorkflowDep):
    submission = workflow_params.user.get_submission(workflow_params.workflow_id)
    url = get_minio_client().presigned_put_object(
        "subsetter-outputs", f"{submission.workflow_name}/{submission.workflow_id}/all.gz"
    )
    return {'url': url}


@router.post('/bucket/create')
async def create_user_bucket(
    user: User = Depends(current_active_user), description="Creates a bucket named with the username"
):
    if not get_minio_client().bucket_exists(user.username):
        get_minio_client().make_bucket(user.username)


@router.get('/upload/{user_name}/workflow/{workflow_id}')
async def share_workflow_with_user(
    user_name: str, workflow_params: WorkflowDep, user: User = Depends(current_active_user)
):
    submission: Submission = workflow_params.submission
    submission.add_user(user_name)
    await user.update_submission(submission)
    return User.get(user.document_id)


@router.get('/remove/{user_name}/workflow/{workflow_id}')
async def share_workflow_with_user(
    user_name: str, workflow_params: WorkflowDep, user: User = Depends(current_active_user)
):
    submission: Submission = workflow_params.submission
    submission.remove_user(user_name)
    await user.update_submission(submission)
    return User.get(document_id=user.document_id)


# @router.post('/extract/{workflow_id}')
# async def extract_workflow_artifact(workflow_params: WorkflowDep) -> SubmissionResponseModel:
#    workflow_id = str(uuid.uuid4())
#    bucket = "subsetter-outputs"
#    submission = workflow_params.user.get_submission(workflow_params.workflow_id)
#    path_key = f'{submission.workflow_name}/{submission.workflow_id}/subset.gz'
#    api_instance.submit_workflow(
#        namespace=get_settings().argo_namespace,
#        body=metadata_extraction_submission_body(bucket, path_key, workflow_id),
#        _preload_content=False,
#    )
#    submission = WorkflowSubmission(workflow_id=workflow_id, workflow_name="extractMD")
#    await workflow_params.user.update_submission(submission)
#    return await submission
