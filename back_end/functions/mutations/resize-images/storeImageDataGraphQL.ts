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

const url = process.env.GRAPHQL;
const region = 'us-west-2';
const type = AUTH_TYPE.AWS_IAM;
import AWS from 'aws-sdk';
const credentials = AWS.config.credentials;

// Import gql helper and craft a GraphQL query
const gql = require('graphql-tag');
const mutation = gql(`
mutation PutImage($input: ImageInput!) {
  putImage(input: $input) {
    id
    name
    lastModified
    filename
    paths {
      path
      type
    }
  }
}
`);

interface Path {
  path: string,
  type: string
}

interface PutImage {
  id: string,
  name: string,
  lastModified: number,
  filename: string,
  paths: Path[]
}

// Set up Apollo client
const client = new AWSAppSyncClient({
  url: url,
  region: region,
  auth: {
    type: type,
    credentials: credentials,
  }
});


export default (name: string, filename: string, paths: Path[]) => {
  const variables = {
    input: {
      name,
      filename,
      paths
    }
  };


  return client.hydrated().then(function (client) {
    return client.mutate<PutImage>({
      mutation,
      variables,
      fetchPolicy: 'no-cache'
    });
  });
}
