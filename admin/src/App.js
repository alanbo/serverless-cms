import React, { Component } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import Snackbar from '@material-ui/core/Snackbar';
import { withAuthenticator } from 'aws-amplify-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPageTypeList, getFragmentList, clearNotification } from './actions/index';

import NavigationFrame from './components/NavigationFrame';
import Main from './components/Main'

import aws_exports from './cognito';
import aws_vars from './aws-stack-vars';
import './App.css';
import fg_config from './fg-config';

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

  componentWillMount() {
    Object.keys(fg_config).forEach(key => {
      const data = fg_config[key];
      this.props.getFragmentList(data.type);
    });

    this.props.getPageTypeList();
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(data => this.setState({ user: data.username }))
      .catch(err => console.log(err));

    // this.props.fetchImageList();
    // this.props.fetchGalleryList();
    // this.props.getTextList();
    // this.props.getMenuList();
    // this.props.getPageList();
  }

  signOut() {
    Auth.signOut()
      .then(data => window.location.reload())
      .catch(err => console.log(err));
  }

  render() {
    const { notification, clearNotification } = this.props;

    return (
      <div className="App">
        <NavigationFrame signOut={this.signOut}>
          <Main />
        </NavigationFrame>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={!!notification}
          onClose={clearNotification}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{notification && notification.msg}</span>}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFragmentList: type => dispatch(getFragmentList(type)),
    getPageTypeList: () => dispatch(getPageTypeList()),
    clearNotification: () => dispatch(clearNotification())
  }
}

export default withAuthenticator(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
);
