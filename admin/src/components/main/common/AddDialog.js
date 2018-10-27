import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    dialog: {
        width: '80vw',
        maxWidth: '80vw'
    }
});


class AddDialog extends React.Component {
  handleClose = () => {
      this.props.onClose();
  };

  handleCancel = () => {
      this.props.onCancel();
  }

  render() {
    const { classes } = this.props;

    return (
      <div> 
        <Dialog
          open={ true }
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          classes={{
            paper: classes.dialog
          }}
        >
          <DialogTitle id="form-dialog-title">{ this.props.title }</DialogTitle>
          <DialogContent>
            <DialogContentText>
              { this.props.text }
            </DialogContentText>
            { this.props.children }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              { this.props.add_btn_text } 
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddDialog);
