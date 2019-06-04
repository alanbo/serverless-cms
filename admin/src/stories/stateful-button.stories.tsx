import React from 'react';
import { storiesOf } from '@storybook/react';
import BackupIcon from '@material-ui/icons/Backup';
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
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))
  .add('Fab Error', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickError}
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))
  .add('Icon Button Success', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickSuccess}
        is_icon_btn={true}
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))
  .add('Icon Button Error', () => (
    <div style={{ position: 'relative' }}>
      <StatefulButton
        onClick={onClickError}
        is_icon_btn={true}
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  ))