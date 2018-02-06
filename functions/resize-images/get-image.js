import AWS from 'aws-sdk';
const s3 = new AWS.S3()

const getImage = (src_bucket, src_key) => new Promise((resolve, reject) => {
  s3.getObject({
    Bucket: src_bucket,
    Key: src_key
  }, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

export default getImage;
