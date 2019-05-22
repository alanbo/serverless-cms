import AWS, { S3 } from 'aws-sdk';

const s3 = new AWS.S3();

export default async (Key: string, Body: S3.Body) => {
  const params: S3.PutObjectRequest = {
    Body,
    Key,
    Bucket: process.env.BUCKET,
    ACL: 'public-read',
    ContentType: 'text/html',
  };

  return s3.putObject(params).promise().catch(console.log);
}