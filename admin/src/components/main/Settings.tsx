import React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { putHeadSettings } from '../../actions';
import TextField from '@material-ui/core/TextField';
import * as R from 'ramda';
import SaveCancelButtons from './common/SaveCancelButtons';

const styles = theme => createStyles({
  textField: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3
  }
});

interface Settings {
  title?: string,
  description?: string,
  keywords?: string
}

interface SettingsObj {
  settings: Settings
}

interface Props extends SettingsObj, WithStyles<typeof styles> {
  putHeadSettings: (input: Settings) => any
}


class SettingsUnstyled extends React.Component<Props, SettingsObj> {
  static getDerivedStateFromProps(props, state) {
    if (R.isEmpty(state.settings) && props.settings && !R.isEmpty(props.settings)) {
      const { keywords, description, title } = props.settings;
      return {
        settings: { keywords, description, title }
      }
    }

    return null;
  }
  state = {
    settings: {} as Settings
  }

  render() {
    const { classes, putHeadSettings } = this.props;

    return (
      <div>

        <h1>Settings</h1>

        <TextField
          label='Title'
          className={classes.textField}
          value={this.state.settings && this.state.settings.title || ''}
          onChange={e => {
            this.setState({
              settings: R.assoc('title', e.target.value, this.state.settings)
            })
          }}
          margin="normal"
        />
        <TextField
          label='Description'
          className={classes.textField}
          value={this.state.settings && this.state.settings.description || ''}
          onChange={e => {
            this.setState({
              settings: R.assoc('description', e.target.value, this.state.settings)
            })
          }}
          margin="normal"
          multiline
        />
        <TextField
          label='Keywords'
          className={classes.textField}
          value={this.state.settings && this.state.settings.keywords || ''}
          onChange={e => {
            this.setState({
              settings: R.assoc('keywords', e.target.value, this.state.settings)
            })
          }}
          multiline
          margin="normal"
        />

        <SaveCancelButtons
          onSave={() => {
            putHeadSettings(this.state.settings);
          }}

          onCancel={() => this.setState({ settings: {} })}
        />
      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  }
}

const Settings = connect(mapStateToProps, { putHeadSettings })(withStyles(styles)(SettingsUnstyled));


export default Settings;
