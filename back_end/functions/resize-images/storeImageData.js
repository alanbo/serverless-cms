import AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const uuid = require('uuid/v4');

export default (metadata, filename, paths) => {
  const Item = {
    id: uuid(),
    lastModified: Math.round(+(new Date()) / 1000),
    name: metadata.name || `${metadata.gallery || 'general'}/${filename}`,
    filename,
    paths,
    type: 'Image',
    is_deleted: false
  };

  const TableName = process.env.FRAGMENTS_TABLE;
  const params = {
    TableName,
    Item
  };

  return new Promise((resolve, reject) => {
    db.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(Item);
      }
    });
  });
}
