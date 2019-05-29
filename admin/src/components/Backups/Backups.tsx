import React, { Component } from 'react';
import BackupsTable from './BackupsTable';
import { useTheme, makeStyles } from '@material-ui/styles';

import {
  Backup_backup
} from './operation-result-types';

const useStyles = makeStyles({

});

interface Props {
  restoreFromBackup: (iso_string: string) => void,
  deleteBackups: (iso_string: string[]) => void,
  data: {
    backups: Backup_backup[]
  },
  backupData: () => void
}

function Backups(props: Props) {
  const { restoreFromBackup, deleteBackups, data: { backups } } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div>
      Hello From Backups
    {
        backups && backups.map(backup => (
          <div key={backup.id}>
            <p >{backup.lastModified}</p>
            <p >{backup.size}</p>
            <a href={backup.url}>Download</a>
            <button onClick={restoreFromBackup.bind(null, backup.id)}>restore</button>
            <button onClick={deleteBackups.bind(null, [backup.id])}>delete</button>
          </div>
        ))
      }
      <button onClick={props.backupData}>Backup</button>

      <BackupsTable title={'Backups'} />

    </div>
  );
}

export default Backups;