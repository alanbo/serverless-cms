import React from 'react';

import Fab from '@material-ui/core/Fab';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[500],
    pointerEvents: 'none'
  },
  error: {
    backgroundColor: red[500],
    pointerEvents: 'none'
  },
  loading: {
    pointerEvents: 'none'
  },
  progress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
}));

interface PropsStatefulButton {
  className: string,
  status: 'success' | 'error' | 'loading' | null,
  onClick: () => void,
  classes?: {
    success?: string,
    error?: string,
    loading?: string,
    default?: string,
    progress?: string
  },
  children: React.ReactNode,
  circSize?: number
}

function StatefulButton(props: PropsStatefulButton) {
  const { status, className, onClick } = props;
  const default_classes = useStyles();

  const classes = Object.assign(default_classes, props.classes || {});
  const circSize = props.circSize || 68;


  const buttonClassname = classes[status || 'default'];

  return (
    <div className={className}>
      <Fab color="primary" className={buttonClassname} onClick={onClick}>
        {
          status === 'success' ? <CheckIcon /> :
            status === 'error' ? <ErrorIcon /> : props.children
        }
      </Fab>
      {status === 'loading' && <CircularProgress size={circSize} className={classes.progress} />}
    </div>
  )
};

export default StatefulButton;