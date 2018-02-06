import AWS from 'aws-sdk';
import getImage from './resize-images/get-image';
import transformImages from './resize-images/transform-images';

// eslint-disable-next-line import/prefer-default-export
export const resizeImages = async function(event, context, callback) {
  const src_bucket = event.Records[0].s3.bucket.name;
  const src_key = event.Records[0].s3.object.key;
  const filename = src_key.split('/').pop();


  try {
    const image_buffer = (await getImage(src_bucket, src_key)).Body;
    const transformed_images = await transformImages(image_buffer);

    console.log('image data: ', transformed_images);
  } catch(e) {
    console.log(e);
  }

  callback(null, 'Image successfully resized');






  // p
  //   .then(() => callback(null, {
  //     message: 'Go Serverless Webpack (Ecma Script) v1.0! First module!',
  //     event,
  //   }))
  //   .catch(e => callback(e));
};
