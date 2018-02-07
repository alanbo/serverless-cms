import AWS from 'aws-sdk';
import getImage from './resize-images/get-image';
import transformImages from './resize-images/transform-images';
import uploadImages from './resize-images/upload-images';

// eslint-disable-next-line import/prefer-default-export
export const resizeImages = async function(event, context, callback) {
  const bucket = event.Records[0].s3.bucket.name;
  const src_key = event.Records[0].s3.object.key;
  const filename = src_key.split('/').pop();

  try {
    const s3_image = (await getImage(bucket, src_key));
    const buffer = s3_image.Body;
    const metadata = s3_image.Metadata;
    const content_type = s3_image.ContentType;
    const images = await transformImages(buffer);
    const upload_data = { images, buffer, metadata, bucket, filename, content_type };

    const stored_images = await uploadImages(upload_data);

  } catch(e) {
    console.log(e);
  }

  callback(null, 'Image successfully resized');
};
