import React, { Component } from 'react';
import Amplify, { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import NavigationFrame from './components/NavigationFrame';
import Main from './components/Main'

import aws_exports from './cognito';
import aws_vars from './aws-stack-vars';
import './App.css';

// window.LOG_LEVEL = 'DEBUG';

console.log('endpoint: ', aws_vars.graphql_endpoint);

const amp_config = {
  Auth: aws_exports,
  Storage: {
    bucket: 'serverless-testing-site-public',
    region: aws_vars.region
  },

  'aws_appsync_graphqlEndpoint': aws_vars.graphql_endpoint,
  'aws_appsync_region': aws_vars.region,
  'aws_appsync_authenticationType': 'AWS_IAM',
};

console.log(amp_config);

Amplify.configure(amp_config);

const getImageList = `
{
  getImageList {
    id
    filename
    paths {
      path
    }
  }
}
`;

API.graphql(graphqlOperation(getImageList)).then(console.log).catch(console.log);

class App extends Component {
  state = {
    user: ''
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
    .then(data => this.setState({ user: data.username }))
    .catch(err => console.log(err));
  }

  signOut() {
    Auth.signOut()
    .then(data => window.location.reload())
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <NavigationFrame signOut={ this.signOut }>
          <Main />
        </NavigationFrame>
      </div>
    );
  }
}

// export default App;

export default withAuthenticator(App);
