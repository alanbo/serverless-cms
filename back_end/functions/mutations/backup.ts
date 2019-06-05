import AWS, { S3 } from 'aws-sdk';
import archiver from 'archiver';
import stream from 'stream';
import { Handler } from 'aws-lambda';

interface Env extends NodeJS.ProcessEnv {
  BUCKET: string,
  FRAGMENTS_TABLE: string,
  REGION: string
}

interface Backup {
  id: string,
  url: string,
  lastModified: string,
  size: number
}

const {
  BUCKET: Bucket,
  FRAGMENTS_TABLE: TableName,
  REGION: region
} = process.env as Env;

const documentClient = new AWS.DynamoDB.DocumentClient({ region });
const s3 = new S3();


const s3_list_params: S3.ListObjectsV2Request = {
  Bucket,
  Prefix: 'public/'
}

const ddb_params: AWS.DynamoDB.DocumentClient.ScanInput = {
  TableName
};


export const handler: Handler<any, Backup> = (event, context, callback) => {

  // create a file to stream archive data to.
  // var output = fs.createWriteStream(__dirname + '/example.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // Create stream from s3 upload
  const uploadFromStream = () => {
    const pass = new stream.PassThrough()
    const iso_date = (new Date()).toISOString();

    const s3params = {
      Bucket,
      Key: `backup/${iso_date}.zip`,
      Body: pass,
      ContentType: 'application/zip'
    }

    s3.upload(s3params).promise()
      .then(async result => {
        const params = {
          Bucket,
          Key: result.Key
        };

        const head = await s3.headObject(params).promise();

        // Synchronous as it is the last operation - it's ok to block
        const url = s3.getSignedUrl('getObject', params);

        const backup = {
          id: result.Key,
          lastModified: head.LastModified.toISOString(),
          size: head.ContentLength,
          url
        };

        callback(null, backup);
      })
      .catch(callback);

    return pass
  }

  const output = uploadFromStream();

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function () {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.log(err);
    } else {
      callback(err);
    }
  });

  // Pipe archived data to s3.
  archive.pipe(output);


  // add streams for each file to archiver
  async function streamBackupData() {
    try {
      // get a list of s3 objects in public directory
      const files = await s3.listObjects(s3_list_params).promise();

      if (files && files.Contents) {
        // append each s3 object readible stream to archiver
        files.Contents.forEach(({ Key }) => {
          if (!Key) {
            return;
          }

          const params: S3.GetObjectRequest = {
            Bucket,
            Key
          };

          archive.append(s3.getObject(params).createReadStream(), { name: Key });
        });
      }

    } catch (e) {
      callback(e);
    }

    // Stream the whole database.
    const dynamoStream = documentClient.scan(ddb_params).createReadStream();
    archive.append(dynamoStream, { name: 'database.json' });

    archive.finalize();
  }

  streamBackupData();
}






