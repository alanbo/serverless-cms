/* global global */
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

function uploadOne(bucket, content_type, metadata, filename, { buffer, key }) {
  const gallery = metadata.gallery || 'general';
  const path = `public/images/${gallery}/${key}/${filename}`;

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
  const { images, buffer, metadata, bucket, filename, content_type } = upload_data;
  const image_data = images.map( img => uploadOne(bucket, content_type, metadata, filename, img));

  return Promise.all(image_data);
};

export default uploadImages;
