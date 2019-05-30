import React from 'react';

import Fab from '@material-ui/core/Fab';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';

interface PropsStatefulButton {
  className: string,
  status: 'success' | 'error' | 'loading' | null,
  onClick: () => void,
  classes: {
    success?: string,
    error?: string,
    loading?: string,
    default?: string
  },
  children: React.ReactNode,
  progressClass: string,
  circSize: number
}

function StatefulButton(props: PropsStatefulButton) {
  const { status, className, onClick, classes, progressClass, circSize } = props;

  const buttonClassname = classes[status || 'default'];

  return (
    <div className={className}>
      <Fab color="primary" className={buttonClassname} onClick={onClick}>
        {
          status === 'success' ? <CheckIcon /> :
            status === 'error' ? <ErrorIcon /> : props.children
        }
      </Fab>
      {status === 'loading' && <CircularProgress size={circSize} className={progressClass} />}
    </div>
  )
};

export default StatefulButton;