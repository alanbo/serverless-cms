import React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';

const styles = theme => createStyles({
  buttons: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  cancel: {
    marginRight: theme.spacing.unit * 2
  }
});

interface Props extends WithStyles<typeof styles> {
  onCancel: () => any,
  onSave: () => any
};

const SaveCancelButtons = (props: Props) => (
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