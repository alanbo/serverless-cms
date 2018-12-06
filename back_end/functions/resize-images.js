import AWS from 'aws-sdk';
import getImage from './resize-images/get-image';
import transformImages from './resize-images/transform-images';
import uploadImages from './resize-images/upload-images';
import settings from './resize-images/settings';
import storeImageDataGraphQL from './resize-images/storeImageDataGraphQL';

// eslint-disable-next-line import/prefer-default-export
export const resizeImages = async function (event, context, callback) {
  // const bucket = event.Records[0].s3.bucket.name;
  // const src_key = event.Records[0].s3.object.key;

  const bucket = process.env.BUCKET;
  const { path: src_key } = event;

  const filename = src_key.split('/').pop();

  const random_str = Math.round(Math.random() * 1000000000).toString(16);
  const resized_filename_arr = filename.split('.');
  const ext = resized_filename_arr.pop();
  const resized_filename = resized_filename_arr.join('.');
  const create_path = key => {
    return {
      type: key,
      path: `public/images/${random_str}-${resized_filename}-${key}.${ext}`
    };
  };

  const paths = Object.keys(settings).map(create_path);

  try {
    const s3_image = (await getImage(bucket, src_key));
    const buffer = s3_image.Body;
    const metadata = s3_image.Metadata;
    const content_type = s3_image.ContentType;
    const images = await transformImages(buffer);
    await uploadImages({ images, paths, metadata, bucket, filename, content_type });
    const image_data = await storeImageDataGraphQL(metadata, filename, paths);
    callback(null, image_data.data.putImage);
  } catch (err) {
    console.log(err);
    callback(err)
  }
};
