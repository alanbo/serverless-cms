import AWS from 'aws-sdk';
import ObjectID from 'bson-objectid';
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
var FRAGMENTS_TABLE = process.env.FRAGMENTS_TABLE;

module.exports.updateData = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(event)
  };

  switch (event.httpMethod) {
    case 'PUT':
      const id = ObjectID().toString('utf8');

      const params = {
        TableName: FRAGMENTS_TABLE,
        Item: {
          id,
          data: JSON.parse(event.body)
        }
      };

      dynamodb.put(params, err => {
        if (err) {
          cb(err);
        } else {
          cb(null, {
            statusCode: 200,
            body: JSON.stringify({ id })
          });
        }
      });
      break;
    case 'PATCH':
      break;
    case 'DELETE':
      break;
  }
}
