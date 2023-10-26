
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
import requests

def bucket_owner(resource_id: str):
    #raccess = ResourceAccess.objects.filter(resource__short_id=resource_id).first()
    #return raccess.owners.first().username
    return "subsetter-outputs"

def create_view_statements(resource_ids: list[str]) -> list:
    view_statement_template_get = \
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetBucketLocation",
            "s3:GetObject"
        ],
        "Resource": []
    }
    view_statement_template_listing = \
    {
        "Effect": "Allow",
        "Action": [
            "s3:ListBucket"
        ],
        "Resource": [],
        "Condition": {
            "StringLike": {
                "s3:prefix": []
            }
        }
    }
    get_resources = []
    list_statements = []
    for resource_id in resource_ids:
        owner = bucket_owner(resource_id)
        get_resources.append(f"arn:aws:s3:::{owner}/hydroshare/{resource_id}/*")
        view_statement = copy.deepcopy(view_statement_template_listing)
        view_statement["Resource"] = [f"arn:aws:s3:::{owner}"]
        view_statement["Condition"]["StringLike"]["s3:prefix"] = [f"hydroshare/{resource_id}/*"]
        list_statements.append(view_statement)
    view_statement_template_get["Resource"] = get_resources
    return list_statements + [view_statement_template_get]


def create_edit_owner_statements(resource_ids: list[str]) -> list:
    edit_statement_template = \
    {
        "Effect": "Allow",
        "Action": [
            "s3:*"
        ],
        "Resource": []
    }
    edit_statement_template["Resource"] = [f"arn:aws:s3:::{bucket_owner(resource_id)}/hydroshare/{resource_id}/*" for resource_id in resource_ids]
    return [edit_statement_template]


def minio_policy(user):
    user_privileges = retrieve_user_resource_privileges(user)
    view_statements = []
    edit_statements = []
    if user_privileges["view"] or user_privileges["edit"] or user_privileges["owner"]:
        view_statements = create_view_statements(user_privileges["view"] + user_privileges["edit"] + user_privileges["owner"])
    if user_privileges["edit"] or user_privileges["owner"]:
        edit_statements = create_edit_owner_statements(user_privileges["edit"] + user_privileges["owner"])
    return \
    {
        "Version": "2012-10-17",
        "Statement": view_statements + edit_statements
    }

def retrieve_user_resource_privileges(user: str) -> dict:
    response = requests.get(f'https://cuahsi-dev-2.hydroshare.org/hsapi/useraccess/{user}/')
    return response.json()