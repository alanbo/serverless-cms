global.WebSocket = require('ws');
global.window = global.window || {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  WebSocket: global.WebSocket,
  ArrayBuffer: global.ArrayBuffer,
  addEventListener: function () { },
  navigator: { onLine: true }
};
global.localStorage = global.window.localStorage = {
  store: {},
  getItem: function (key) {
    return this.store[key]
  },
  setItem: function (key, value) {
    this.store[key] = value
  },
  removeItem: function (key) {
    delete this.store[key]
  }
};

import 'isomorphic-fetch';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import AWSAppSyncClient from 'aws-appsync';

const url = process.env.GRAPHQL;
const region = 'us-west-2';
const type = AUTH_TYPE.AWS_IAM;
import AWS from 'aws-sdk';
const credentials = AWS.config.credentials;


// Set up Apollo client
const client = new AWSAppSyncClient({
  url: url,
  region: region,
  auth: {
    type: type,
    credentials: credentials,
  }
});

export default (query, variables) => {
  return client.hydrated().then(client => {
    return client.query({
      query,
      variables,
      fetchPolicy: 'no-cache'
    });
  });
}