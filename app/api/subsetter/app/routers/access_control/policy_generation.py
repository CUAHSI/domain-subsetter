import copy
import json
import logging as logger
import os
import subprocess
import tempfile
from typing import Dict


def admin_policy_create(target, name, file):
    arguments = ['mc', '--json', 'admin', 'policy', 'create', target, name, file]
    logger.info(arguments)
    try:
        _output = subprocess.check_output(arguments)
        logger.info(_output)
    except subprocess.CalledProcessError as e:
        logger.exception(e.output)


def admin_policy_remove(target, name):
    arguments = ['mc', '--json', 'admin', 'policy', 'rm', target, name]
    logger.info(arguments)
    try:
        _output = subprocess.check_output(arguments)
        logger.info(_output)
    except subprocess.CalledProcessError as e:
        logger.exception(e.output)


def refresh_minio_policy(user, policy):
    logger.info(json.dumps(policy, indent=2))
    with tempfile.TemporaryDirectory() as tmpdirname:
        filepath = os.path.join(tmpdirname, "metadata.json")
        fp = open(filepath, "w")
        fp.write(json.dumps(policy))
        fp.close()
        admin_policy_create(target='cuahsi', name=user.username, file=filepath)
    return policy


def create_view_statements(user, views: Dict[str, list[str]]) -> list:
    if not views:
        return []
    view_statement_template_get_object = {
        "Effect": "Allow",
        "Action": ["s3:GetObject"],
        "Resource": [],
    }
    view_statement_template_get_bucket = {
        "Effect": "Allow",
        "Action": ["s3:GetBucketLocation"],
        "Resource": [],
    }
    view_statement_template_listing = {
        "Effect": "Allow",
        "Action": ["s3:ListBucket"],
        "Resource": [],
        "Condition": {"StringLike": {"s3:prefix": []}},
    }

    get_objectt_resources = []
    get_bucket_resources = []
    list_statements = []
    for bucket_owner, resource_paths in views.items():
        get_objectt_resources = get_objectt_resources + [
            f"arn:aws:s3:::{bucket_owner}/{resource_path}/*" for resource_path in resource_paths
        ]
        get_bucket_resources.append(f"arn:aws:s3:::{bucket_owner}")
        view_statement = copy.deepcopy(view_statement_template_listing)
        view_statement["Resource"] = [f"arn:aws:s3:::{bucket_owner}"]
        view_statement["Condition"]["StringLike"]["s3:prefix"] = [
            f"{resource_path}/*" for resource_path in resource_paths
        ]
        list_statements.append(view_statement)
    view_statement_template_get_object["Resource"] = get_objectt_resources
    view_statement_template_get_bucket["Resource"] = get_bucket_resources
    return list_statements + [view_statement_template_get_object]


def create_edit_statements(user, edits: Dict[str, list[str]]) -> list:
    edit_all_statement = {
        "Effect": "Allow",
        "Action": ["s3:*"],
        "Resource": [f"arn:aws:s3:::{user.username}"],
    }
    edit_paths_resources = []
    for bucket_owner, resource_paths in edits.items():
        edit_paths_resources = edit_paths_resources + [
            f"arn:aws:s3:::{bucket_owner}/{resource_path}/*" for resource_path in resource_paths
        ]

    edit_paths_statement = {
        "Effect": "Allow",
        "Action": ["s3:*Object"],
        "Resource": edit_paths_resources,
    }
    list_bucket_statement = {
        "Effect": "Allow",
        "Action": ["s3:ListBucket"],
        "Resource": [f"arn:aws:s3:::{bucket_owner}" for bucket_owner, _ in edits.items()],
    }
    statements = [edit_all_statement, edit_paths_statement, list_bucket_statement]
    return [statement for statement in statements if statement]


def minio_policy(user, owners: Dict[str, list[str]], edits: Dict[str, list[str]], views: Dict[str, list[str]]):
    statements = create_view_statements(user, views)
    statements = statements + create_edit_statements(user, edits)
    return {"Version": "2012-10-17", "Statement": statements}
