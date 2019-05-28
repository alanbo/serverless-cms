import React, { Component } from 'react';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({

});

interface Props {
  restoreFromBackup: (iso_string: string) => void,
  deleteBackups: (iso_string: string[]) => void,
  backups?: string[],
  backupData: () => void
}

function Backups(props: Props) {
  const { restoreFromBackup, deleteBackups, backups } = props;
  const theme = useTheme();
  const classes = useStyles(theme);


  return (
    <div>
      Hello From Backups
    {
        backups && backups.map(backup => (
          <div key={backup}>
            <p >{backup}</p>
            <button onClick={restoreFromBackup.bind(null, backup)}>restore</button>
            <button onClick={deleteBackups.bind(null, [backup])}>delete</button>
          </div>
        ))
      }
      <button onClick={props.backupData}>Backup</button>
    </div>
  );
}

export default Backups;