import AWS, { S3 } from 'aws-sdk';
import unzipper from 'unzipper';
import JSONStream from 'JSONStream';
import stream from 'stream';

// Create stream from s3 upload
const uploadFromStream = (Bucket: string, Key: string, callback?: (err: any, iso_date?: string) => void): stream.PassThrough => {
  const pass = new stream.PassThrough()
  const iso_date = (new Date()).toISOString();

  const s3params = {
    Bucket,
    Key,
    Body: pass,
    ContentType: 'application/zip'
  }

  s3.upload(s3params).promise()
    .then(callback ? callback.bind(null, null, iso_date) : console.log)
    .catch(callback);

  return pass;
}

interface Env extends NodeJS.ProcessEnv {
  BUCKET: string,
  FRAGMENTS_TABLE: string,
  REGION: string
}

const {
  BUCKET: Bucket,
  FRAGMENTS_TABLE: TableName,
  REGION: region
} = process.env as Env;


const db = new AWS.DynamoDB({ region });
const s3 = new S3();

const ddb_params: AWS.DynamoDB.DocumentClient.ScanInput = {
  TableName,
  ProjectionExpression: 'id'
};

interface AppSyncEvent {
  id: string
}

function uploadToDatabase(file: unzipper.File): NodeJS.ReadWriteStream {
  return file
    .stream()
    .pipe(JSONStream.parse('Items.*'))
    .on('data', async Item => {
      try {
        await db.putItem({ Item, TableName }).promise();
      } catch (e) {
        console.log(e);
      }
    })
    .on('error', console.log)
    .on('end', () => console.log('Succesfully uploaded backup data to DynamoDb'))
};


export const handler = (event: AppSyncEvent, context: undefined, callback = console.log) => {
  async function main() {
    let directory: unzipper.CentralDirectory;

    try {
      directory = await unzipper.Open.s3(s3, {
        Bucket,
        Key: event.id
      });
    } catch (e) {
      callback(e);
    }

    let database_file: unzipper.File;
    let dynamo_delete_finished = false;
    let dynamo_upload_finished = false;
    let s3_upload_finished = false;

    const dynamoStream = db.scan(ddb_params).createReadStream();


    type DynamoStreamChunk = { id: { S: string } }[] | number;

    dynamoStream
      .pipe(JSONStream.parse('*'))
      .on('data', (data: DynamoStreamChunk) => {
        if (Array.isArray(data)) {
          data.forEach(Key => {
            db.deleteItem({
              TableName,
              Key
            }).promise().catch(callback);
          })
        }
      })
      .on('error', callback)
      .on('end', () => {
        if (database_file) {
          uploadToDatabase(database_file).on('end', () => {
            dynamo_upload_finished = true;

            if (s3_upload_finished) {
              callback(null, true);
            }
          });
        } else {
          dynamo_delete_finished = true;
        }

        console.log('Successfully deleted DynamoDB Data');
      });

    let objects;

    try {
      objects = await s3.listObjectsV2({ Bucket, Prefix: 'public/' }).promise();
    } catch (e) {
      callback(e);
    }

    if (objects && objects.Contents.length) {
      try {
        await s3.deleteObjects({
          Bucket,
          Delete: {
            Objects: objects.Contents.map(object => ({
              Key: object.Key
            })),
            Quiet: false
          }
        })
          .promise();

      } catch (e) {
        callback(e);
      }
    }

    let uploaded_files_num = 0;

    directory.files.forEach(file => {
      if (file.path === 'database.json') {
        if (dynamo_delete_finished) {
          uploadToDatabase(file).on('end', () => {
            dynamo_upload_finished = true;

            if (s3_upload_finished) {
              callback(null, true);
            }
          });
        } else {
          database_file = file;
        }
      } else {
        const upload_stream = uploadFromStream(Bucket, file.path, (err: any, iso: string) => {
          if (err) {
            callback(err);
          } else {
            uploaded_files_num++;

            if (uploaded_files_num === directory.files.length - 1) {
              console.log('Successfully finished uploading files to s3');

              s3_upload_finished = true;

              if (dynamo_upload_finished) {
                callback(null, true);
              }
            }
          }
        });

        file
          .stream()
          .pipe(upload_stream)
      }
    });
  }
  main();
};
