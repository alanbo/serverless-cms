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
  Storage: {
    bucket: 'serverless-testing-site-public',
    region: 'us-west-2'
  }
});

Storage.configure({
    bucket: 'serverless-testing-site-public',
    region: 'us-west-2',
    identityPoolId: aws_exports.identityPoolId//Specify your identityPoolId for Auth and Unauth access to your bucket;
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

    Storage.put('test.txt', 'Protected Content', {
    level: 'public',
    contentType: 'text/plain'
    })
    .then (result => console.log(result))
    .catch(err => console.log(err));

    Storage.get('Udemy22.png', { level: 'public' })
      .then(result => console.log(JSON.stringify(result)))
      .catch(err => console.log(err));

    Storage.list('/', { level: 'public' })
    .then(result => console.log(result))
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
