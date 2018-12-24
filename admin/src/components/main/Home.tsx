import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';

import { renderPages } from '../../actions';


const styles = theme => createStyles({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 6
  },

});


interface Props extends WithStyles<typeof styles> {
  renderPages: () => any
}

const HomeUnstyled = (props: Props) => {
  const { classes } = props;

  return <div>
    <Typography variant="headline" component="h1">
      Home
    </Typography>
    <Paper className={classes.paper} elevation={1}>
      <Typography variant="headline" component="h3">
        Welcome to Serverless CMS.
      </Typography>
      <Typography component="p">
        This is the first experimental version of the cms. It already works but still needs a lot of improvements and fixes. Use at your own risk :-). If you'd like to contribute or report bugs visit the project's github page: <a
          href='https://github.com/alanbo/serverless-cms'
          target='_blank'
        >https://github.com/alanbo/serverless-cms</a>
      </Typography>
    </Paper>
    <Button variant="contained" color="default" onClick={props.renderPages}>
      Render pages
        <LaunchIcon />
    </Button>
  </div>;
};

const Home = connect(null, { renderPages })(withStyles(styles)(HomeUnstyled));

export { Home };
