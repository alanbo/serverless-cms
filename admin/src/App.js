import React, { Component } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from './actions/index';

import NavigationFrame from './components/NavigationFrame';
import Main from './components/Main'

import aws_exports from './cognito';
import aws_vars from './aws-stack-vars';
import './App.css';

// window.LOG_LEVEL = 'DEBUG';


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


Amplify.configure(amp_config);


class App extends Component {
  state = {
    user: ''
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(data => this.setState({ user: data.username }))
      .catch(err => console.log(err));

    this.props.fetchImageList();
    this.props.fetchGalleryList();
    this.props.getTextList();
    this.props.getMenuList();
  }

  signOut() {
    Auth.signOut()
      .then(data => window.location.reload())
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <NavigationFrame signOut={this.signOut}>
          <Main />
        </NavigationFrame>
      </div>
    );
  }
}

export default withAuthenticator(
  withRouter(connect(null, actionCreators)(App))
);
