import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';

const styles = theme => ({
  buttons: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  cancel: {
    marginRight: theme.spacing.unit * 2
  }
});

const SaveCancelButtons = props => (
  <div className={props.classes.buttons} >
    <Button
      variant="fab"
      color="secondary"
      aria-label="cancel"
      onClick={props.onCancel}
      className={props.classes.cancel}
    >
      <CancelIcon />
    </Button>
    <Button
      variant="fab"
      color="primary"
      aria-label="save"
      onClick={props.onSave}
    >
      <SaveIcon />
    </Button>
  </div>
);

export default withStyles(styles)(SaveCancelButtons);