import AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
var IMG_TABLE = process.env.IMG_TABLE;

function storeImageData(metadata, filename, paths) {
  const params = {
    TableName: IMG_TABLE,
    Item: {
      filename: filename,
      createdAt: (new Date()).getTime(),
      gallery: metadata.gallery || 'general',
      metadata,
      paths
    }
  };

  return new Promise((resolve, reject) => {
    dynamodb.put(params, err => {
      if (err) {
        reject(err)
      } else {
        resolve('success');
      }
    });
  });
}

export default storeImageData;
