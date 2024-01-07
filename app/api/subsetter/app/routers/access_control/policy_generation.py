'''
def admin_policy_attach(target, name):
    arguments = ['mc', '--config-dir', '/hydroshare/', 'admin', 'policy', 'attach', target, name, '--user', name]
    logger.info(arguments)
    try:
        _output = subprocess.check_output(arguments, user='hydro-service')
        logger.info(_output)
    except subprocess.CalledProcessError as e:
        logger.exception(e.output)

import subprocess
def admin_policy_create(target, name, file):
    arguments = ['mc', '--config-dir', '/hydroshare/', '--json', 'admin', 'policy', 'create', target, name, file]
    logger.info(arguments)
    try:
        _output = subprocess.check_output(arguments, user='hydro-service')
        logger.info(_output)
    except subprocess.CalledProcessError as e:
        logger.exception(e.output)
    admin_policy_attach(target, name)

def admin_policy_remove(target, name):
    arguments = ['mc', '--config-dir', '/hydroshare/', '--json', 'admin', 'policy', 'remove', target, name]
    logger.info(arguments)
    try:
        _output = subprocess.check_output(arguments, user='hydro-service')
        logger.info(_output)
    except subprocess.CalledProcessError as e:
        logger.exception(e.output)

def refresh_minio_policy(user):
    policy = minio_policy(user)
    logging.info(json.dumps(policy, indent=2))
    if policy["Statement"]:
        with tempfile.TemporaryDirectory(dir='/hs_tmp') as tmpdirname:
            filepath = os.path.join(tmpdirname, "metadata.json")
            fp = open(filepath, "w")
            fp.write(json.dumps(policy))
            fp.close()
            admin_policy_remove(target='cuahsi', name=user.username)
            admin_policy_create(target='cuahsi', name=user.username, file=filepath)
    else:
        admin_policy_remove(target='cuahsi', name=user.username)
'''

import copy
from typing import Dict


def bucket_name(resource_id: str):
    # raccess = ResourceAccess.objects.filter(resource__short_id=resource_id).first()
    # return raccess.owners.first().username
    return "subsetter-outputs"


def create_view_statements(user, views: Dict[str, list[str]]) -> list:
    view_statement_template_get = {
        "Effect": "Allow",
        "Action": ["s3:GetBucketLocation", "s3:GetObject"],
        "Resource": [],
    }
    view_statement_template_listing = {
        "Effect": "Allow",
        "Action": ["s3:ListBucket"],
        "Resource": [],
        "Condition": {"StringLike": {"s3:prefix": []}},
    }

    get_resources = [f"arn:aws:s3:::{user.username}/*"]
    view_statement = copy.deepcopy(view_statement_template_listing)
    view_statement["Resource"] = [f"arn:aws:s3:::{user.username}"]
    del view_statement["Condition"]
    list_statements = [view_statement]
    for bucket_owner, resource_paths in views.items():
        get_resources = get_resources + [
            f"arn:aws:s3:::{bucket_owner}/{resource_path}/*" for resource_path in resource_paths
        ]
        view_statement = copy.deepcopy(view_statement_template_listing)
        view_statement["Resource"] = [f"arn:aws:s3:::{bucket_owner}"]
        view_statement["Condition"]["StringLike"]["s3:prefix"] = [
            f"{resource_path}/*" for resource_path in resource_paths
        ]
        list_statements.append(view_statement)
    view_statement_template_get["Resource"] = get_resources
    return list_statements + [view_statement_template_get]


def create_edit_statements(user, edits: Dict[str, list[str]]) -> list:
    edit_statement_template = {"Effect": "Allow", "Action": ["s3:*"], "Resource": []}
    resources = []
    for bucket_owner, resource_paths in edits.items():
        resources = resources + [f"arn:aws:s3:::{bucket_owner}/{resource_path}/*" for resource_path in resource_paths]
    edit_statement_template["Resource"] = resources
    return [edit_statement_template]


def minio_policy(user, owners: Dict[str, list[str]], edits: Dict[str, list[str]], views: Dict[str, list[str]]):
    statements = create_view_statements(user, views)
    statements = statements + create_edit_statements(user, edits)
    return {"Version": "2012-10-17", "Statement": statements}
