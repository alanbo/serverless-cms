import { createStyles, WithStyles } from '@material-ui/core';

const styles = theme => createStyles({
  name_input: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3
  }
});

export default styles;

export interface PageStyle extends WithStyles<typeof styles> { };