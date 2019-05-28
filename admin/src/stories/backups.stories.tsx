import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Backups from '../components/Backups/Backups';


const backups = [
  'backup/2019-05-26T18:07:59.826Z.zip',
  'backup/2019-05-26T06:24:27.613Z.zip',
  'backup/2019-05-26T06:24:30.375Z.zip',
  'backup/2019-05-26T06:24:32.611Z.zip'
];


storiesOf('Backups', module)
  .add('default', () => (
    <Backups
      restoreFromBackup={action('Restore From Backup')}
      deleteBackups={action('Delete Backups')}
      backupData={action('Backup Data')}
      backups={backups}
    />
  ));
