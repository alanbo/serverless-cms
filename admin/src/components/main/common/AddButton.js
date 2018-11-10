import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  button: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

const AddButton = props => (
  <Button
    variant="fab"
    color="primary"
    aria-label="add"
    className={props.classes.button} onClick={props.onClick}
  >
    <AddIcon />
  </Button>
);

export default withStyles(styles)(AddButton);