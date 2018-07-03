import AWS from 'aws-sdk';
import removeEach from './delete-images/remove-each';

// eslint-disable-next-line import/prefer-default-export
export const deleteImages = async function(event, context, callback) {
  const bucket = event.Records[0].s3.bucket.name;
  const src_key = event.Records[0].s3.object.key;
  const filename = src_key.split('/').pop();



  try {
    console.log(src_key);
    await removeEach(bucket, src_key);

  } catch(e) {
    console.log(e);
    callback(e);
  }

  callback(null, 'Image successfully resized');
};
