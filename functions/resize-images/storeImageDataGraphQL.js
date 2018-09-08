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

// Import gql helper and craft a GraphQL query
const gql = require('graphql-tag');
const mutation = gql(`
  mutation AddImage($input: ImageInput) {
    addImage(input: $input) {
      id
      paths {
        path
      }
    }
  }
`);

// Set up Apollo client
const client = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
        type: type,
        credentials: credentials,
    }
});

export default (metadata, filename, paths) => {
  const variables = {
  input: {
    gallery: metadata.gallery || 'general',
    filename,
    paths
    }
  };

  client.hydrated().then(function (client) {
      client.mutate({
        mutation,
        variables,
        fetchPolicy: 'no-cache'
      }) ;
  });
}
