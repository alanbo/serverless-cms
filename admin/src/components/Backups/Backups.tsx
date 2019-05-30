import React from 'react';
import Fab from '@material-ui/core/Fab';
import BackupIcon from '@material-ui/icons/Backup';
import BackupsTable from './BackupsTable';
import { makeStyles } from '@material-ui/core/styles';
import * as R from 'ramda';


import {
  Backup_backup
} from './operation-result-types';

const useStyles = makeStyles(theme => ({
  button: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

interface Props {
  restoreFromBackup: (iso_string: string) => void,
  deleteBackups: (iso_string: string[]) => void,
  data: {
    backups: Backup_backup[],
    loading: boolean
  },
  backupData: () => void
}

function Backups(props: Props) {
  const { restoreFromBackup, deleteBackups, data: { backups, loading } } = props;
  const classes = useStyles();

  // TO DO: add proper loading spinner
  if (loading) {
    return <div>Loading</div>;
  }

  const table_data = backups
    .map(item => R.assoc('lastModified', +(new Date(item.lastModified)), item));


  return (
    <div>
      <BackupsTable
        title={'Backups'}
        onRestore={restoreFromBackup}
        data={table_data}
        onDelete={deleteBackups}
      />

      <Fab
        color="primary"
        aria-label="add"
        className={classes.button}
        onClick={() => props.backupData()}
      >
        <BackupIcon />
      </Fab>

    </div>
  );
}

export default Backups;