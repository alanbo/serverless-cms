import AWS from 'aws-sdk';
import getImage from './resize-images/getImage';
import transformImages from './resize-images/transformImages';
import uploadImages from './resize-images/upload-images';
import settings from './resize-images/settings';
import storeImageData from './resize-images/storeImageData';
import { Handler } from 'aws-lambda';

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async function (event: { paths: string[] }, context, callback) {
  async function processImage(src_key: string) {
    const bucket = process.env.BUCKET;
    const filename = src_key.split('/').pop();
    const random_str = Math.round(Math.random() * 1000000000).toString(16);
    const resized_filename_arr = filename.split('.');
    const ext = resized_filename_arr.pop();
    const resized_filename = resized_filename_arr.join('.');

    const create_path = (key: string) => {
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
      const images = await transformImages(buffer as Buffer);
      const image_name = metadata.name || `${metadata.gallery || 'general'}/${filename}`;

      await uploadImages({ images, paths, metadata, bucket, filename, content_type });

      return storeImageData(image_name, filename, paths)
        .then(result => {
          return result;
        })
        .catch(callback);
    } catch (err) {
      callback(err);
    }
  }

  try {
    const results = await Promise.all(event.paths.map(processImage));
    callback(null, results);
  } catch (err) {
    callback(err);
  }
};
