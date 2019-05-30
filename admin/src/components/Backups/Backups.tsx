import React, { Component } from 'react';
import BackupsTable from './BackupsTable';
import { useTheme, makeStyles } from '@material-ui/styles';
import * as R from 'ramda';


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

  if (!backups) {
    return <div>Loading</div>;
  }

  const table_data = backups
    .map(item => R.assoc('lastModified', +(new Date(item.lastModified)), item));

  console.log(table_data);

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

      <BackupsTable
        title={'Backups'}
        onRestore={console.log}
        data={table_data}
      />

    </div>
  );
}

export default Backups;