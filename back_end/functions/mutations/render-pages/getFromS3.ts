import * as R from 'ramda';
import path from 'path';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export default async (path_str: string, prefixed?: boolean) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: prefixed ? R.tail(path.resolve('/templates', path_str)) : path_str,
  };

  return s3.getObject(params).promise().then(data => data.Body).catch(console.log);
}