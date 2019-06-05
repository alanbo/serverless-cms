import R from 'ramda';
import AWS from 'aws-sdk';
import { Handler } from 'aws-lambda';

var documentClient = new AWS.DynamoDB.DocumentClient();

export const handler: Handler = async (event: string[]) => {
  if (!event || !event.length) {
    return [];
  }

  const images_uniq = R.uniq(event);

  const Keys = images_uniq.map(id => ({ id }));

  var params = {
    RequestItems: {
      [process.env.FRAGMENTS_TABLE]: {
        Keys
      }
    }
  };


  const resp = await new Promise((resolve, reject) => {
    documentClient.batchGet(params, function (err, data) {
      if (err) reject(err);

      else resolve(data.Responses[process.env.FRAGMENTS_TABLE]);
    });
  });

  if (Array.isArray(resp)) {
    const resp_map: { [ix: string]: any } = {};

    resp.forEach(obj => {
      resp_map[obj.id] = obj;
    });

    return event.map(id => resp_map[id]);
  }

  return resp;
};