import AWS, { S3 } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import * as R from 'ramda';

interface Env extends NodeJS.ProcessEnv {
  BUCKET: string,
  BUCKET_PROD: string,
  FRAGMENTS_TABLE: string,
  REGION: string
}

const {
  BUCKET: Bucket,
  BUCKET_PROD: BucketProd
} = process.env as Env;

const s3 = new S3();

export const handler: Handler<void, boolean> = async () => {
  let staging_list;
  let production_list;

  try {
    staging_list = (await s3.listObjectsV2({ Bucket }).promise()).Contents || [];
    production_list = (await s3.listObjectsV2({ Bucket: BucketProd }).promise()).Contents || [];
  } catch (e) {
    return e;
  }

  // only newser files than in production
  const filtered = R.differenceWith<S3.Object, S3.Object>(
    (stag, prod) => {
      return stag.Key === prod.Key && stag.LastModified > prod.LastModified
    },
    // filter staging related folders
    R.reject<S3.Object, 'array'>(
      R.propSatisfies(
        R.test(/^(admin|backup|templates|public\/temp)/),
        'Key'
      )
    )(staging_list),
    production_list
  );

  const irrelevant = R.difference(
    R.map(R.prop('Key'), production_list),
    R.map(R.prop('Key'), staging_list)
  );

  // clean up files that are not longer necessary
  if (irrelevant.length) {
    try {
      await s3.deleteObjects({
        Bucket: BucketProd,
        Delete: {
          Objects: irrelevant.map(Key => ({
            Key
          })),
          Quiet: false
        }
      })
        .promise();

      return true;

    } catch (e) {
      return e;
    }
  }

  // stream relevant files from staging to production
  const uploads = filtered.map(file => {
    const stream = s3.getObject({
      Bucket,
      Key: file.Key
    }).createReadStream();

    return s3.upload({
      Key: file.Key,
      Bucket: BucketProd,
      Body: stream
    }).promise();
  });

  try {
    await Promise.all(uploads);
  } catch (e) {
    return e;
  }

  return true;
}