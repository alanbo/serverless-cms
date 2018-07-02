import AWS from 'aws-sdk';

// eslint-disable-next-line import/prefer-default-export
export const deleteImages = async function(event, context, callback) {
  const bucket = event.Records[0].s3.bucket.name;
  const src_key = event.Records[0].s3.object.key;
  const filename = src_key.split('/').pop();

  try {
    console.log(filename);

  } catch(e) {
    console.log(e);
  }

  callback(null, 'Image successfully resized');
};
