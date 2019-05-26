import AWS, { S3 } from 'aws-sdk';
import { Handler } from 'aws-lambda';

interface Env extends NodeJS.ProcessEnv {
  BUCKET: string,
}

const {
  BUCKET: Bucket,
} = process.env as Env;

const s3 = new S3();

interface Event {
  iso_dates: string[]
}


export const handler: Handler<Event, boolean | AWS.AWSError> = async (event) => {
  try {
    try {
      await s3.deleteObjects({
        Bucket,
        Delete: {
          Objects: event.iso_dates.map(iso_date => ({
            Key: `backup/${iso_date}.zip`
          })),
          Quiet: false
        }
      })
        .promise();

      return true;

    } catch (e) {
      return e;
    }
  } catch (e) {
    return e;
  }
}