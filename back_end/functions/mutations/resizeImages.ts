import settings from './resize-images/settings';
import { Handler } from 'aws-lambda';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import R from 'ramda';
import stream, { pipeline } from 'stream';
import uuid from 'uuid/v4';

const db = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const s3 = new AWS.S3()


export const handler: Handler = async function (event: { paths: string[] }) {
  async function processImage(origin_path: string) {
    const Bucket = process.env.BUCKET;
    const random_str = Math.round(Math.random() * 1000000000).toString(16);
    const filename = R.match(/.+\/(.+?)\.\w+$/, origin_path)[1];

    const create_path = (type: string, ext: 'jpg' | 'webp') => {
      return `public/images/${random_str}-${filename}-${type}.${ext}`;
    };

    // TO DO: Write better error handling. Missing error handling for streams. 
    const file_stream = s3.getObject({
      Bucket,
      Key: origin_path
    }).createReadStream();

    const all = Object.keys(settings).map(type => {
      const { height, width } = settings[type];
      const pass_jpg = new stream.PassThrough();
      const pass_webp = new stream.PassThrough();

      file_stream.pipe(pass_jpg);
      file_stream.pipe(pass_webp);

      // TO DO: Write better error handling. Missing error handling for streams. 
      const webp_transform = sharp()
        .resize(width, height, { fit: 'contain' })
        .toFormat('webp');

      // TO DO: Write better error handling. Missing error handling for streams. 
      const jpg_transform = sharp()
        .resize(width, height, { fit: 'contain' })
        .toFormat('webp');

      const webp_key = create_path(type, 'webp');
      const jpg_key = create_path(type, 'jpg');

      const webp_upload = s3.upload({
        Bucket,
        Key: webp_key,
        Body: pass_webp.pipe(webp_transform),
        ContentType: 'image/webp'
      }).promise().then(() => ({
        type,
        path: webp_key
      }));

      const jpg_upload = s3.upload({
        Bucket,
        Key: jpg_key,
        Body: pass_jpg.pipe(jpg_transform),
        ContentType: 'image/jpeg'
      }).promise().then(() => ({
        type,
        path: jpg_key
      }));

      return Promise.all([webp_upload, jpg_upload]);
    });

    const paths = await Promise.all(all).then(R.flatten);

    return {
      id: uuid(),
      filename,
      name: filename,
      lastModified: Math.round(+(new Date()) / 1000),
      is_deleted: false,
      paths
    }
  }

  try {
    const images = await Promise.all(event.paths.map(processImage));

    const requests = images.map(Item => ({ PutRequest: { Item } }));

    var params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [process.env.FRAGMENTS_TABLE]: requests
      }
    };

    await db.batchWrite(params).promise();

    return images;
  } catch (e) {
    return e;
  }
};
