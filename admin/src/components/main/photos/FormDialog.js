import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const match = /^[a-zA-Z0-9_]+$/ig;

export default class FormDialog extends React.Component {
  state = {
    text: '',
    error: false
  };

  handleClose = (prop) => {
    if (match.test(this.state.text)){
      this.setState({ error: false });
      console.log('close', this.state.text);
      this.props.onClose(this.state.text);
    } else {
      this.setState({ error: true });
    }
  };

  handleCancel = () => {
    this.props.onClose(null);
  }

  render() {
    return (
      <div>
        <Dialog
          open={ true }
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Gallery</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type in the name of the gallery. It should be composed of alphanumeric characters and underscores.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Gallery Name"
              type="text"
              fullWidth
              value={ this.state.text }
              onChange={ e => this.setState({ text: e.target.value })}
              error={ this.state.error }
            />
            { this.props.children }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Add Gallery
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
