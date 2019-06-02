import AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const uuid = require('uuid/v4');

interface Path {
  path: string,
  type: string
}

export default (name: string, filename: string, paths: Path[]) => {
  const Item = {
    id: uuid(),
    lastModified: Math.round(+(new Date()) / 1000),
    name,
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

  return new Promise<typeof Item>((resolve, reject) => {
    db.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(Item);
      }
    });
  });
}
