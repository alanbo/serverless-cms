import React from 'react';
import Button from '@material-ui/core/Button';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { MutationFn } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import StatefulButton from '../shared/StatefulButton';

type Mutation = MutationFn<{ succsess: boolean | null }>

const useStyles = makeStyles(theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6)
  },
  renderButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));


interface Props {
  renderPages: Mutation,
  publish: Mutation
}

const Home = (props: Props) => {
  const classes = useStyles();

  return <div>
    <Typography variant='h5' component="h1">
      Home
    </Typography>
    <Paper className={classes.paper} elevation={1}>
      <Typography variant='h5' component="h3">
        Welcome to Serverless CMS.
      </Typography>
      <Typography component="p">
        This is the first experimental version of the cms. It already works but still needs a lot of improvements and fixes. Use at your own risk :-). If you'd like to contribute or report bugs visit the project's github page: <a
          href='https://github.com/alanbo/serverless-cms'
          target='_blank'
        >https://github.com/alanbo/serverless-cms</a>
      </Typography>
    </Paper>
    <div className={classes.renderButtonsWrapper}>
      <StatefulButton
        onClick={props.renderPages}
        type='rect'
        text='Render to staging'
      >
        <LaunchIcon />
      </StatefulButton>
      <StatefulButton
        onClick={props.publish}
        type='rect'
        text='Render to production'
      >
        <LaunchIcon />
      </StatefulButton>
    </div>
  </div>;
};

export default Home;
