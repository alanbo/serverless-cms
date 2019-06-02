import AWS from 'aws-sdk';
const s3 = new AWS.S3()

type GetImageOutput = Promise<AWS.S3.GetObjectOutput>;

const getImage = (Bucket: string, Key: string): GetImageOutput => new Promise((resolve, reject) => {
  s3.getObject({ Bucket, Key }, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

export default getImage;
