import { S3 } from 'aws-sdk';
import { Handler } from 'aws-lambda';

interface Env extends NodeJS.ProcessEnv {
  BUCKET: string,
}

const {
  BUCKET: Bucket,
} = process.env as Env;

const s3 = new S3();


const s3_list_params: S3.ListObjectsV2Request = {
  Bucket,
  Prefix: 'backup/'
}


export const handler: Handler<any, string[] | Error> = async () => {
  try {
    const objects = await s3.listObjectsV2(s3_list_params).promise();
    return objects.Contents.map(item => item.Key);
  } catch (e) {
    return e;
  }
}