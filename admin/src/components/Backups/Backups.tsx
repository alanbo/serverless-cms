import React from 'react';
import BackupIcon from '@material-ui/icons/Backup';
import { makeStyles } from '@material-ui/core/styles';

import * as R from 'ramda';

import BackupsTable from './BackupsTable';
import StatefulButton from '../shared/StatefulButton';


import {
  Backup_backup
} from './operation-result-types';

const useStyles = makeStyles(theme => ({
  button: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  root: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

interface Props {
  restoreFromBackup: (iso_string: string) => Promise<any>,
  deleteBackups: (iso_string: string[]) => Promise<any>,
  data: {
    backups: Backup_backup[],
    loading: boolean
  },
  backupData: () => Promise<any>
}

function Backups(props: Props) {
  const { restoreFromBackup, deleteBackups, data: { backups, loading } } = props;
  const classes = useStyles();

  if (loading) {
    return <div>Loading</div>;
  }

  const table_data = backups
    .map(item => R.assoc('lastModified', +(new Date(item.lastModified)), item));


  return (
    <div className={classes.root}>
      <BackupsTable
        title={'Backups'}
        onRestore={restoreFromBackup}
        data={table_data}
        onDelete={deleteBackups}
      />

      <StatefulButton
        className={classes.button}
        onClick={props.backupData}
      >
        <BackupIcon />
      </StatefulButton>
    </div>
  );
}


export default Backups;