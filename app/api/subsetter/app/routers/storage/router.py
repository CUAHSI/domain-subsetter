from fastapi import APIRouter

from subsetter.app.models import WorkflowDep
from subsetter.config.minio import get_minio_client

router = APIRouter()


@router.get('/presigned/get/{workflow_id}', description="Create a download url")
async def presigned_get_minio(workflow_params: WorkflowDep):
    submission = workflow_params.user.get_submission(workflow_params.workflow_id)
    url = get_minio_client().presigned_get_object(
        workflow_params.user.username, f"argo_workflows/{submission.workflow_name}/{submission.workflow_id}"
    )
    return {'url': url}


@router.get('/presigned/put/{bucket}', description="Create a PUT file presigned url")
async def presigned_put_minio(bucket: str, path: str):
    url = get_minio_client().presigned_put_object(bucket, path)
    return {'url': url}


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
