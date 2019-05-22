import AWS, { S3 } from 'aws-sdk';
import stream from 'stream';
const s3 = new S3();

// Create stream from s3 upload
const uploadFromStream = (Bucket: string, Key: string, callback?: (err: any, iso_date?: string) => void): stream.PassThrough => {
  const pass = new stream.PassThrough()
  const iso_date = (new Date()).toISOString();

  const s3params = {
    Bucket,
    Key,
    Body: pass,
    ContentType: 'application/zip'
  }

  s3.upload(s3params).promise()
    .then(callback ? callback.bind(null, null, iso_date) : console.log)
    .catch(callback);

  return pass;
}

export default uploadFromStream;