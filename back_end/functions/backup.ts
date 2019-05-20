import AWS, { S3 } from 'aws-sdk';
import archiver from 'archiver';
import stream from 'stream';
import { Handler } from 'aws-lambda';

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });
const s3 = new S3();

const s3_list_params: S3.ListObjectsV2Request = {
  Bucket: 'www.myslscmswebsite2.com',
  Prefix: 'public/'
}

const ddb_params: AWS.DynamoDB.DocumentClient.ScanInput = {
  TableName: 'my-sls-cms-website2-fragments',
};


export const handler: Handler<any, string> = (event, context, callback) => {

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
      Bucket: 'www.myslscmswebsite2.com',
      Key: `backup/${iso_date}.zip`,
      Body: pass,
      ContentType: 'application/zip'
    }

    s3.upload(s3params).promise().then(callback.bind(null, null, iso_date)).catch(callback);

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
            Bucket: 'www.myslscmswebsite2.com',
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






