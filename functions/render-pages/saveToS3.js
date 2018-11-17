import * as R from 'ramda';
import path from 'path';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export default async (Key, Body) => {
  const params = {
    Body,
    Key,
    Bucket: process.env.BUCKET,
    ACL: 'public-read',
    ContentType: 'text/html',
  };

  return s3.putObject(params).promise().catch(console.log);
}