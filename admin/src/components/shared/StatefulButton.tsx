import React from 'react';

import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
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
  onClick: () => Promise<any>,
  onTimeout?: () => void,
  classes?: {
    success?: string,
    error?: string,
    loading?: string,
    default?: string,
    progress?: string
  },
  children: React.ReactNode,
  circSize?: number,
  is_icon_btn?: boolean
}

const StatefulButton = React.forwardRef<HTMLDivElement, PropsStatefulButton>((props, ref) => {
  const { className, onTimeout } = props;
  const default_classes = useStyles();

  const classes = Object.assign({}, default_classes, props.classes || {});
  const circSize = props.circSize || 68;
  const [status, setStatus] = React.useState<'success' | 'error' | 'loading' | 'default'>('default');
  let timeout: NodeJS.Timeout;

  // Clear timeout if element unmounts before it's finished.
  React.useEffect(() => () => timeout && clearTimeout(timeout));

  async function onClick() {
    setStatus('loading');

    try {
      await props.onClick();
      setStatus('success');

    } catch (e) {
      setStatus('error');
    }

    timeout = setTimeout(() => {
      setStatus('default');
      if (onTimeout) {
        onTimeout();
      }
    }, 1000);
  }


  const buttonClassname = classes[status];

  const Button = props.is_icon_btn
    ? (props) => <IconButton {...props} />
    : (props) => <Fab {...props} />;

  interface BtnProps {
    className?: string,
    onClick: () => void,
    color?: string
  }

  const btn_props: BtnProps = {
    className: buttonClassname,
    onClick
  }

  if (!props.is_icon_btn) {
    btn_props.color = 'primary';
  }

  return (
    <div className={className} ref={ref}>
      <Button {...btn_props}>
        {
          status === 'success' ? <CheckIcon /> :
            status === 'error' ? <ErrorIcon /> : props.children
        }
      </Button>
      {status === 'loading' && <CircularProgress size={circSize} className={classes.progress} />}
    </div>
  )
});

export default StatefulButton;