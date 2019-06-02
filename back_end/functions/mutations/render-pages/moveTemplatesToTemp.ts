import path from 'path';
import AWS from 'aws-sdk';
import getFromS3 from './getFromS3';
import util from 'util';

// @ts-ignore
import fs from 'fs-path';
const writeFile = util.promisify(fs.writeFile);
const s3 = new AWS.S3();

export default async () => {
  const params = {
    Bucket: process.env.BUCKET,
    Prefix: 'templates'
  };

  const s3_object_list = await s3
    .listObjectsV2(params)
    .promise()
    .then(output => output.Contents);

  const file_list = s3_object_list.filter(obj => !!obj.Size).map(obj => obj.Key);
  const buffers = await Promise.all(file_list.map(file_path => getFromS3(file_path)));

  return Promise.all(buffers.map((buffer, i) => {
    return writeFile(path.resolve('/tmp', file_list[i]), buffer).catch(console.log);
  }));
}