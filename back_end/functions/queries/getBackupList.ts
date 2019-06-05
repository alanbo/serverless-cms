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

interface Params {
  Key: string,
  Bucket: string,
  Expires: number
}

const getSignedUrl = (params: Params) => new Promise((resolve, reject) => {
  s3.getSignedUrl('getObject', params, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  })
});


export const handler: Handler<any, string[] | Error> = async () => {
  try {
    const objects = await s3.listObjectsV2(s3_list_params).promise();
    const result = objects.Contents.map(async item => {

      const url = await getSignedUrl({
        Key: item.Key,
        Bucket,
        Expires: 604800
      });

      const output = {
        id: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        url
      }

      return output;
    });
    return Promise.all(result);
  }
  catch (e) {
    return e;
  }
}