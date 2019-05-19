import { S3 } from 'aws-sdk';
import fs from 'fs';
import archiver from 'archiver';

// create a file to stream archive data to.
var output = fs.createWriteStream(__dirname + '/example.zip');
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

archive.pipe(output);

const s3 = new S3();

const params: S3.ListObjectsV2Request = {
  Bucket: 'www.myslscmswebsite2.com',
  Prefix: 'public/'
}


async function getObjectStreams() {
  const files = await s3.listObjects(params).promise();

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



