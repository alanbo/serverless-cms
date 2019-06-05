import React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';

const styles = theme => createStyles({
  Fabs: {
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

const SaveCancelFabs = (props: Props) => (
  <div className={props.classes.Fabs} >
    <Fab
      color="secondary"
      aria-label="cancel"
      onClick={props.onCancel}
      className={props.classes.cancel}
    >
      <CancelIcon />
    </Fab>
    <Fab
      aria-label="save"
      onClick={props.onSave}
    >
      <SaveIcon />
    </Fab>
  </div>
);

export default withStyles(styles)(SaveCancelFabs);