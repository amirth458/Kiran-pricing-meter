import os, sys, json, boto3
from botocore.exceptions import ClientError


def get_config_value(key):
    with open('../eb_deploy_config.json') as json_file:
        data = json.load(json_file)
        if key in data[os.environ["ENV"]]:
            return data[os.environ["ENV"]][key]
    raise Exception ("Failed to get property - " + key)


def upload_to_s3(file_name):
    try:
        client = boto3.client('s3', region_name=get_config_value("AWS_REGION_NAME"),
                              aws_access_key_id=get_config_value("AWS_ACCESS_KEY"),
                              aws_secret_access_key=get_config_value("AWS_SECRET_KEY"))
        bucket_name = get_config_value("S3_BUCKET_NAME")
        print("Uploading file(" + file_name + ") to S3 Bucket: " + bucket_name + ", Key: " + file_name)

        client.put_object(
            Body=open(file_name, 'rb'),
            Bucket=bucket_name,
            Key=file_name
        )
    except ClientError as err:
        raise Exception("Failed to upload file.\n" + str(err))


if __name__ == "__main__":
    os.environ["ENV"] = sys.argv[1]
    upload_to_s3("backend-web.template")
    upload_to_s3("backend-web-eb.template")
