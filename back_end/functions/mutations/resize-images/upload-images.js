/* global global */
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

function uploadOne(bucket, content_type, metadata, path, { buffer, key }) {
  const gallery = metadata.gallery || 'general';

  return new Promise((resolve, reject) => {
    s3.putObject({
        Bucket: bucket,
        Key: path,
        Body: buffer,
        ContentType: content_type,
        ACL: 'public-read',
        Metadata: metadata
    }, err => {
      if (err) {
        reject(err);
      } else {
        resolve({ path, type: key });
      }
    });
  });
}

const uploadImages = upload_data => {
  const { images, paths, metadata, bucket, filename, content_type } = upload_data;
  const image_data = images.map((img, i) => uploadOne(bucket, content_type, metadata, paths[i].path, img));

  return Promise.all(image_data);
};

export default uploadImages;
