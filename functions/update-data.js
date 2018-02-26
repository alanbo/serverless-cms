import AWS from 'aws-sdk';
import ObjectID from 'bson-objectid';
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
var FRAGMENTS_TABLE = process.env.FRAGMENTS_TABLE;

module.exports.updateData = (event, context, cb) => {
  const body = event.body ? JSON.parse(event.body) : {};

  switch (event.httpMethod) {
    case 'PUT':
    case 'POST':
      const id = ObjectID().toString('utf8');
      const params = {
        TableName: FRAGMENTS_TABLE,
        Item: {
          id,
          type: body.type || 'general',
          data: body.data
        }
      };

      dynamodb.put(params, err => {
        if (err) {
          console.log('err: ', err);
          cb(null, {
            statusCode: 400,
            body: err.errorMessage
          });
        } else {
          cb(null, {
            statusCode: 200,
            body: JSON.stringify({ id })
          });
        }
      });
      break;

    case 'PATCH':
      const patchParams = {
        TableName: FRAGMENTS_TABLE,
        Key: event.pathParameters,
        UpdateExpression: body.update,
        ExpressionAttributeValues: body.values,
        ReturnValues: 'ALL_NEW',
        ConditionExpression: 'attribute_exists(id)'
      };

      if (body.names) {
        patchParams.ExpressionAttributeNames = body.names;
      }


      dynamodb.update(patchParams, (err, data) => {
        if (err) {
          console.log('err: ', err);
          cb(null, {
            statusCode: 400,
            body: err.message
          });
        } else {
          cb(null, {
            statusCode: 200,
            body: JSON.stringify(data)
          });
        }
      });
      break;

    case 'DELETE':
      const delParams = {
        TableName: FRAGMENTS_TABLE,
        Key: event.pathParameters
      };

      dynamodb.delete(delParams, err => {
        if (err) {
          cb(null, {
            statusCode: 400,
            body: err.errorMessage
          });
        } else {
          cb(null, {
            statusCode: 200,
            body: 'Item deleted'
          });
        }
      });
      break;
  }
}
