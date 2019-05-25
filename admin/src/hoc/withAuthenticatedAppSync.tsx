import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from '../cognito';
import aws_vars from '../aws-stack-vars';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'
import { ApolloProvider } from 'react-apollo'
import { Rehydrated } from 'aws-appsync-react'
import { withAuthenticator } from 'aws-amplify-react';

const amp_config = {
  Auth: aws_exports,
  Storage: {
    bucket: aws_vars.bucket,
    region: aws_vars.region
  },

  'aws_appsync_graphqlEndpoint': aws_vars.graphql_endpoint,
  'aws_appsync_region': aws_vars.region,
  'aws_appsync_authenticationType': 'AWS_IAM',
};

Amplify.configure(amp_config);

const client = new AWSAppSyncClient({
  url: aws_vars.graphql_endpoint,
  region: aws_vars.region,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: async () => {
      return await Auth.currentCredentials();
    },
  }
});

const ApolloWraper = props => (
  <ApolloProvider client={client}>
    <Rehydrated>
      {props.children}
    </Rehydrated>
  </ApolloProvider>
);

// @ts-ignore
window.__APOLLO_CLIENT__ = client;

export default function withAuthenticatedAppSync(WrappedComponent) {
  const Authed = withAuthenticator(WrappedComponent);

  return (props) => (
    <ApolloWraper>
      <Authed {...props} />
    </ApolloWraper>
  )
};
