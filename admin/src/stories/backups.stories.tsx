import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Backups from '../components/Backups/Backups';


const backups = [
  {
    "id": "backup/2019-06-11T21:45:26.233Z.zip",
    "lastModified": "2019-06-11T21:45:28.000Z",
    "size": 4444487,
    "url": "https://aws-amplify.github.io/",
    "__typename": "Backup"
  },
  {
    "id": "backup/2019-06-11T21:45:30.608Z.zip",
    "lastModified": "2019-06-11T21:45:32.000Z",
    "size": 4444487,
    "url": "https://aws-amplify.github.io/",
    "__typename": "Backup"
  },
  {
    "id": "backup/2019-06-11T21:45:47.920Z.zip",
    "lastModified": "2019-06-11T21:45:49.000Z",
    "size": 4444487,
    "url": "https://aws-amplify.github.io/",
    "__typename": "Backup"
  }
];


storiesOf('Backups', module)
  .add('default', () => (
    <Backups
      restoreFromBackup={action('Restore From Backup')}
      deleteBackups={action('Delete Backups')}
      backupData={action('Backup Data')}
      data={{
        backups,
        loading: false
      }}
    />
  ))
  .add('loading', () => (
    <div style={{ height: '500px' }}>

      <Backups
        restoreFromBackup={action('Restore From Backup')}
        deleteBackups={action('Delete Backups')}
        backupData={action('Backup Data')}
        data={{
          backups: null,
          loading: true
        }}
      />
    </div>
  ));
