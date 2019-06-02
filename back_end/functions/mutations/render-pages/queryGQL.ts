// @ts-ignore
global.WebSocket = require('ws');
// @ts-ignore
global.window = global.window || {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  // @ts-ignore
  WebSocket: global.WebSocket,
  ArrayBuffer: global.ArrayBuffer,
  addEventListener: function () { },
  navigator: { onLine: true }
};
// @ts-ignore
global.localStorage = global.window.localStorage = {
  store: {},
  // @ts-ignore
  getItem: function (key) {
    return this.store[key]
  },
  // @ts-ignore
  setItem: function (key, value) {
    this.store[key] = value
  },
  // @ts-ignore
  removeItem: function (key) {
    delete this.store[key]
  }
};

import 'isomorphic-fetch';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import AWSAppSyncClient from 'aws-appsync';
import { DocumentNode } from 'graphql';

const url = process.env.GRAPHQL;
const region = process.env.AWS_REGION;
const type = AUTH_TYPE.AWS_IAM;
import AWS from 'aws-sdk';

AWS.config.update({
  region,
  credentials: new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_SESSION_TOKEN)
});

const credentials = AWS.config.credentials;

// Set up Apollo client
const client = new AWSAppSyncClient({
  url,
  region,
  auth: {
    type: type,
    credentials: credentials,
  }
});

export default <T, V = any>(query: DocumentNode, variables?: V) => {
  return client.hydrated().then(client => {
    return client.query<T, V>({
      query,
      variables,
      fetchPolicy: 'no-cache'
    });
  });
}