import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ButtonBar from './components/ButtonBar';

import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import aws_exports from './cognito';

Amplify.configure(aws_exports);

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
        <ButtonBar signOut={ this.signOut }>
          <p className="App-intro">
            Hello { this.state.user }
          </p>
        </ButtonBar>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Serverless CMS Admin Dashboard</h1>
          <a onClick={ this.signOut }>Sign Out</a>
        </header> */}
      </div>
    );
  }
}

// export default App;

export default withAuthenticator(App);
