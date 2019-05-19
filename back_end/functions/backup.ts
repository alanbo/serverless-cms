import { S3 } from 'aws-sdk';
import fs from 'fs';
import archiver from 'archiver';
import stream from 'stream';

// create a file to stream archive data to.
// var output = fs.createWriteStream(__dirname + '/example.zip');
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

const s3 = new S3();

// Create stream from s3 upload
const uploadFromStream = () => {
  const pass = new stream.PassThrough()

  const s3params = {
    Bucket: 'www.myslscmswebsite2.com',
    Key: `backup/${(new Date()).toISOString()}.zip`,
    Body: pass,
    ContentType: 'application/zip'
  }

  s3.upload(s3params).promise().then(console.log).catch(console.log);

  return pass
}

// Pipe archived data to s3.
archive.pipe(uploadFromStream());


// add streams for each file to archiver
async function getObjectStreams() {
  const params: S3.ListObjectsV2Request = {
    Bucket: 'www.myslscmswebsite2.com',
    Prefix: 'public/'
  }
  const files = await s3.listObjects(params).promise();

  // append each s3 object readible stream to archiver
  files.Contents.forEach(({ Key }) => {
    const params: S3.GetObjectRequest = {
      Bucket: 'www.myslscmswebsite2.com',
      Key
    };

    archive.append(s3.getObject(params).createReadStream(), { name: Key });
  });

  archive.finalize();
}

getObjectStreams();



