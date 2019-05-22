import AWS, { S3 } from 'aws-sdk';
import unzipper from 'unzipper';
import JSONStream from 'JSONStream';
import uploadFromStream from './backup/uploadFromStream';

interface Env extends NodeJS.ProcessEnv {
  BUCKET: string,
  FRAGMENTS_TABLE: string,
  REGION: string
}

const {
  BUCKET: Bucket,
  // FRAGMENTS_TABLE: TableName,
  REGION: region
} = process.env as Env;

const TableName = 'my-sls-cms-website2-fragments';

const db = new AWS.DynamoDB({ region: 'us-west-2' });
const s3 = new S3();

const ddb_params: AWS.DynamoDB.DocumentClient.ScanInput = {
  TableName,
  ProjectionExpression: 'id'
};

interface AppSyncEvent {
  args: {
    iso_date: string
  }
}

const s3_list_params: S3.ListObjectsV2Request = {
  Bucket: 'www.myslscmswebsite2.com',
  Prefix: 'public/'
}

function uploadToDatabase(file: unzipper.File): NodeJS.ReadWriteStream {
  return file
    .stream()
    .pipe(JSONStream.parse('Items.*'))
    .on('data', async Item => {
      await db.putItem({ Item, TableName: 'my-sls-cms-website2-fragments' }).promise();
    })
    .on('error', console.log)
    .on('end', () => console.log('Succesfully uploaded backup data to DynamoDb'))
};


export const handler = (event: AppSyncEvent, context: undefined, callback = console.log) => {
  async function main() {
    const directory = await unzipper.Open.s3(s3, {
      Bucket: 'www.myslscmswebsite2.com',
      Key: `backup/${event.args.iso_date}.zip`
    });

    let database_file: unzipper.File;
    let dynamo_delete_finished = false;
    let dynamo_upload_finished = false;
    let s3_upload_finished = false;

    const dynamoStream = db.scan(ddb_params).createReadStream();


    type DynamoStreamChunk = { id: { S: string } }[] | number;

    dynamoStream
      .pipe(JSONStream.parse('*'))
      .on('data', (data: DynamoStreamChunk) => {
        console.log(data);
        if (Array.isArray(data)) {
          data.forEach(Key => {
            db.deleteItem({
              TableName,
              Key
            })
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


    const objects = await s3.listObjectsV2({ Bucket: 'www.myslscmswebsite2.com', Prefix: 'public/' }).promise();

    if (objects && objects.Contents.length) {
      try {
        await s3.deleteObjects({
          Bucket: 'www.myslscmswebsite2.com',
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
        const upload_stream = uploadFromStream('www.myslscmswebsite2.com', file.path, (err: any, iso: string) => {
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

handler({ args: { iso_date: '2019-05-20T20:17:54.510Z' } }, undefined, undefined);