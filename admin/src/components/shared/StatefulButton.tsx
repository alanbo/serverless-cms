import React from 'react';

import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';


type BtnType = 'fab' | 'icon' | 'rect';

const useStyles = makeStyles<{}, { type: BtnType }>(theme => ({
  success: props => {
    switch (props.type) {
      case 'fab':
        return {
          backgroundColor: green[500],
          pointerEvents: 'none'
        }
      case 'icon':
        return {
          color: 'white',
          backgroundColor: green[500],
          pointerEvents: 'none'
        }
      case 'rect':
        return {
          color: 'white',
          backgroundColor: green[500],
          pointerEvents: 'none'
        }
    }
  },
  error: props => {
    switch (props.type) {
      case 'fab':
        return {
          backgroundColor: red[500],
          pointerEvents: 'none',
        }
      case 'icon':
        return {
          backgroundColor: red[500],
          pointerEvents: 'none',
          color: 'white'
        }
      case 'rect':
        return {
          backgroundColor: red[500],
          pointerEvents: 'none',
          color: 'white'
        }
    }
  },
  loading: {
    pointerEvents: 'none'
  },
  progressIcon: {
    color: green[500],
  },
  btnText: {
    marginRight: 10
  },
  progress: props => {
    switch (props.type) {
      case 'fab':
        return {
          position: 'absolute',
          top: -6,
          left: -6,
          zIndex: 1,
        }
      case 'icon':
        return {
          position: 'absolute',
          top: 4,
          left: 4,
          zIndex: 1,
        }
      case 'rect':
        return {
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }
    }
  }
}));


interface PropsStatefulButton {
  className?: string,
  onClick: () => Promise<any>,
  onTimeout?: () => void,
  children: React.ReactNode,
  type: BtnType,
  text?: string
}

const circ_sizes = {
  fab: 68,
  icon: 40,
  square: 30
}

const StatefulButton = React.forwardRef<HTMLDivElement, PropsStatefulButton>((props, ref) => {
  const { className, onTimeout } = props;
  const classes = useStyles({ type: props.type });

  const circSize = circ_sizes[props.type];
  const [status, setStatus] = React.useState<'success' | 'error' | 'loading' | 'default'>('default');
  let timeout: NodeJS.Timeout;

  // Clear timeout if element unmounts before it's finished.
  React.useEffect(() => () => timeout && clearTimeout(timeout));

  async function onClick(e: Event) {
    e.stopPropagation();
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

  let ButtonElem;

  switch (props.type) {
    case 'fab':
      ButtonElem = (props) => <Fab {...props} />
      break;
    case 'icon':
      ButtonElem = (props) => <IconButton {...props} />
      break;
    case 'rect':
      ButtonElem = (props) => <Button
        {...props}
        variant="contained"
        color="primary"
      />
      break;
  }

  interface BtnProps {
    className?: string,
    onClick: (e: Event) => void,
    color?: string
  }

  const btn_props: BtnProps = {
    className: buttonClassname,
    onClick
  }

  if (props.type === 'fab') {
    btn_props.color = 'primary';
  }

  return (
    <div className={className} ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <ButtonElem {...btn_props}>
        {props.text && <span className={classes.btnText}>{props.text}</span>}
        {
          status === 'success' ? <CheckIcon /> :
            status === 'error' ? <ErrorIcon /> : props.children
        }
      </ButtonElem>
      {status === 'loading' && <div className={classes.progress}>
        <CircularProgress size={circSize} className={classes.progressIcon} />
      </div>}
    </div>
  )
});

export default StatefulButton;