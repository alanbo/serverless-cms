import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import NavigationFrame from './components/NavigationFrame';
import Main from './components/Main'
import { Switch, Route } from 'react-router-dom'

import Amplify, { Auth, Storage } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import aws_exports from './cognito';

Amplify.configure({
  Auth: aws_exports,
  Storage: 'serverless-testing-site-public'
});

class App extends Component {
  state = {
    user: ''
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
    // .then(data => console.log(data))
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
