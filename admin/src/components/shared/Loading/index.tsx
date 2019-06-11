import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  }
}));

const Loading = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <CircularProgress color="secondary" />
    </div>
  )
}

export default Loading;