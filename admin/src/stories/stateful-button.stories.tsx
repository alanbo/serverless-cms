import React from 'react';
import { storiesOf } from '@storybook/react';
import BackupIcon from '@material-ui/icons/Backup';
import LaunchIcon from '@material-ui/icons/Launch';
import { action } from '@storybook/addon-actions';
import StatefulButton from '../components/shared/StatefulButton';

const onClickSuccess = () => new Promise((resolve, reject) => {
  setTimeout(resolve, 1500);
});

const onClickError = () => new Promise((resolve, reject) => {
  setTimeout(reject, 1500);
});

storiesOf('Stateful Button', module)
  .add('Fab Success', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickSuccess}
        type='fab'
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))
  .add('Fab Error', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickError}
        type='fab'
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))
  .add('Icon Button Success', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickSuccess}
        type='icon'
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))
  .add('Icon Button Error', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickError}
        type='icon'
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))
  .add('Rect Button Success', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickSuccess}
        type='rect'
        text='Render to staging'
      >
        <LaunchIcon />
      </StatefulButton>
    </div >
  ))
  .add('Rect Button Error', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickError}
        type='rect'
        text='Render to staging'
      >
        <LaunchIcon />
      </StatefulButton>
    </div>
  ));