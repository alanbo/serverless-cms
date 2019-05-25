import React, { Component } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import Snackbar from '@material-ui/core/Snackbar';
import { withAuthenticator } from 'aws-amplify-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPageTypeList, getFragmentList, clearNotification, getHeadSettings } from './actions/index';
import * as R from 'ramda';
import NavigationFrame from './components/NavigationFrame';
import Main from './components/Main'
import SnackbarContent from './components/SnackbarContent';
import withAuthenticatedAppSync from './hoc/withAuthenticatedAppSync';

import aws_exports from './cognito';
import './App.css';
import fg_config from './components/inputs/input-config';
// window.LOG_LEVEL = 'DEBUG';

interface Props {
  getFragmentList: (type: string) => void,
  getPageTypeList: () => void,
  getHeadSettings: () => void,
  clearNotification: () => void,
  notification: {
    timeout: number,
    msg: string,
    type: 'success' | 'warning' | 'error' | 'info'
  }
}


class App extends Component<Props> {
  state = {
    user: '',
    notification_open: false,
    closing: false,
  }

  static getDerivedStateFromProps(props, state) {
    if (R.has('msg', props.notification) && !state.closing) {
      return { notification_open: true }
    }

    return null;
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(data => this.setState({ user: data.username }))
      .catch(err => console.log(err));

    Object.keys(fg_config).forEach(key => {
      const data = fg_config[key];
      this.props.getFragmentList(data.type);
    });

    this.props.getPageTypeList();
    this.props.getHeadSettings();
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
          open={this.state.notification_open}
          autoHideDuration={(notification && notification.timeout)}
          onClose={() => this.setState({ notification_open: false, closing: true })}
          onExited={() => {
            this.setState({ closing: false });
            clearNotification();
          }}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        >
          <SnackbarContent
            // @ts-ignore
            message={(<span id="message-id">{notification && notification.msg}</span>)}
            variant={(notification && notification.type) || 'info'}
            onClose={() => this.setState({ notification_open: false, closing: true })}
          />
        </ Snackbar>
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
    clearNotification: () => dispatch(clearNotification()),
    getHeadSettings: () => dispatch(getHeadSettings())
  }
}

export default withAuthenticatedAppSync(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
);
