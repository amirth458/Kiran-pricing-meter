# Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
# except in compliance with the License. A copy of the License is located at
#
#     http://aws.amazon.com/apache2.0/
#
# or in the "license" file accompanying this file. This file is distributed on an "AS IS"
# BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under the License.
"""
A Bitbucket Builds template for deploying
an application to AWS Elastic Beanstalk
joshcb@amazon.com
v1.0.0
"""
from __future__ import print_function
import sys, os
from time import strftime, sleep
import boto3
from botocore.exceptions import ClientError
import json

VERSION_LABEL = strftime("%Y%m%d%H%M%S")
BUCKET_KEY = VERSION_LABEL + '-builds.zip'


def get_config_value(key):
    with open('eb_deploy_config.json') as json_file:
        data = json.load(json_file)
        if key in data[os.environ["ENV"]]:
            return data[os.environ["ENV"]][key]
    raise Exception ("Failed to get property - " + key)


def upload_to_s3(artifact):
    """
    Uploads an artifact to Amazon S3
    """
    try:
        client = boto3.client('s3', region_name=get_config_value("AWS_REGION_NAME"),
                              aws_access_key_id=get_config_value("AWS_ACCESS_KEY"),
                              aws_secret_access_key=get_config_value("AWS_SECRET_KEY"))
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        bucket_name = get_config_value("S3_BUCKET_NAME")
        object_key_name = get_bucket_key()
        print("Uploading file(" + artifact + ") to S3 Bucket: " + bucket_name + ", Key: " + object_key_name)

        client.put_object(
            Body=open(artifact, 'rb'),
            Bucket=bucket_name,
            Key=object_key_name
        )
    except ClientError as err:
        print("Failed to upload artifact to S3.\n" + str(err))
        return False
    except IOError as err:
        print("Failed to access zip in this directory.\n" + str(err))
        return False

    return True


def create_new_version():
    """
    Creates a new application version in AWS Elastic Beanstalk
    """
    try:
        client = get_elastic_beanstalk_client()
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        print("Create Application Version for Application: " + get_config_value("EB_APPLICATION_NAME") + ", Environment: " + get_config_value("EB_APPLICATION_ENVIRONMENT_NAME") + ", Version: " + VERSION_LABEL)

        response = client.create_application_version(
            ApplicationName=get_config_value("EB_APPLICATION_NAME"),
            VersionLabel=VERSION_LABEL,
            Description='New build',
            SourceBundle={
                'S3Bucket': get_config_value("S3_BUCKET_NAME"),
                'S3Key': get_bucket_key()
            },
            Process=True
        )
    except ClientError as err:
        print("Failed to create application version.\n" + str(err))
        return False

    try:
        if response['ResponseMetadata']['HTTPStatusCode'] is 200:
            return True
        else:
            print(response)
            return False
    except (KeyError, TypeError) as err:
        print(str(err))
        return False


def deploy_new_version():
    """
    Deploy a new version to AWS Elastic Beanstalk
    """
    try:
        client = get_elastic_beanstalk_client()
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        print("Deploying Application Version for Application: " + get_config_value("EB_APPLICATION_NAME") + ", Environment: " + get_config_value("EB_APPLICATION_ENVIRONMENT_NAME") + ", Version: " + VERSION_LABEL)

        response = client.update_environment(
            ApplicationName=get_config_value("EB_APPLICATION_NAME"),
            EnvironmentName=get_config_value("EB_APPLICATION_ENVIRONMENT_NAME"),
            VersionLabel=VERSION_LABEL,
        )
    except ClientError as err:
        print("Failed to update environment.\n" + str(err))
        return False

    print(response)
    return True


def get_elastic_beanstalk_client():
    return boto3.client('elasticbeanstalk', region_name=get_config_value("AWS_REGION_NAME"),
                        aws_access_key_id=get_config_value("AWS_ACCESS_KEY"),
                        aws_secret_access_key=get_config_value("AWS_SECRET_KEY"))


def get_bucket_key():
    return get_config_value("EB_APPLICATION_NAME") + "/" + get_config_value("EB_APPLICATION_ENVIRONMENT_NAME") + "/" + BUCKET_KEY


def get_zip_file_path():
    directory = "target"
    for filename in os.listdir(directory):
        if filename.endswith("-bundle.zip"):
            return os.path.abspath(os.path.join(directory, filename))
        else:
            continue
    raise Exception("Zip file not found...")


if __name__ == "__main__":
    os.environ["ENV"] = sys.argv[1]
    zip_file_path = get_zip_file_path()
    print("zip_file_path: " + zip_file_path)

    boto3.set_stream_logger(name='botocore')
    if not upload_to_s3(zip_file_path):
        sys.exit(1)

    if not create_new_version():
        sys.exit(1)
    # Wait for the new version to be consistent before deploying
    sleep(5)

    if not deploy_new_version():
        sys.exit(1)
