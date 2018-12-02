import { createStyles } from '@material-ui/core/styles';

export default theme => createStyles({
  button: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});