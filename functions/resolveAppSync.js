import * as R from 'ramda';

var AWS = require("aws-sdk");

var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  if (!event || !event.length) {
    return [];
  }

  const images_uniq = R.uniq(event);

  const Keys = images_uniq.map(id => ({ id, type: 'image' }))

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
    const resp_map = {};

    resp.forEach(obj => {
      resp_map[obj.id] = obj;
    });

    return event.map(id => resp_map[id]);
  }

  console.log(resp);

  return resp;

};