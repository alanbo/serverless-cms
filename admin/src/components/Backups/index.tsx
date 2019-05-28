import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import * as R from 'ramda';
import Backups from './Backups';

import {
  GetBackupList,
  Backup,
  RestoreFromBackup,
  RestoreFromBackupVariables,
  DeleteBackups,
  DeleteBackupsVariables
} from './operation-result-types';

export const getBackupListQuery = gql`
  query GetBackupList {
    backups: getBackupList,
  }
`;

export const backupMutation = gql`
  mutation Backup {
    iso_date: backup
  }
`;

export const restoreFromBackupMutation = gql`
  mutation RestoreFromBackup($iso_date: String!) {
    success: restoreFromBackup(iso_date: $iso_date)
  }
`;

export const deleteBackupsMutation = gql`
  mutation DeleteBackups($iso_dates: [String!]!) {
    success: deleteBackups(iso_dates: $iso_dates)
  }
`;


export default compose(
  graphql<{}, GetBackupList, void, { backups: string[] }>(getBackupListQuery, {
    props: (props) => {
      return R.pipe(
        R.path<string[] | undefined>(['data', 'backups']),
        R.defaultTo([]),
        R.filter<string, 'array'>(item => item !== null),
        R.map(
          R.replace(/(backup\/|(\.zip))/g, '')
        ),
        R.assoc('backups', R.__, {})
      )(props);
    }
  }),

  graphql<{}, RestoreFromBackup, RestoreFromBackupVariables, { restoreFromBackup(iso_date: string) }>(restoreFromBackupMutation, {
    props: (props) => ({
      restoreFromBackup: (iso_date) => {
        props.mutate!({
          variables: { iso_date }
        })
      }
    })
  }),

  graphql<{}, DeleteBackups, DeleteBackupsVariables, { deleteBackups(iso_dates: string[]) }>(deleteBackupsMutation, {
    props: (props) => ({
      deleteBackups: (iso_dates: string[]) => {
        console.log(iso_dates);
        props.mutate!({
          variables: { iso_dates },
          update: (dataProxy, result) => {
            const query = getBackupListQuery;

            if (!result.data) {
              return;
            }

            const old_data = dataProxy.readQuery<GetBackupList>({ query });

            if (!old_data) {
              return;
            }

            const paths = iso_dates.map(iso_date => `backup/${iso_date}.zip`);
            console.log('paths', paths);
            console.log('old_data.backups', old_data.backups);
            const backups = R.without(paths, old_data.backups);

            console.log(backups);

            dataProxy.writeQuery({ query, data: { backups } });
          }
        });
      }

    })
  }),

  graphql<{}, Backup, void, { backupData: () => void }>(backupMutation, {
    props: (props) => ({
      backupData: () => {
        props.mutate!({
          update: (dataProxy, result) => {
            if (!result.data) {
              return;
            }

            const query = getBackupListQuery;
            const old_data = dataProxy.readQuery<GetBackupList>({ query });

            if (!old_data) {
              return;
            }

            const backups = R.append(
              `backup/${result.data.iso_date}.zip`,
              old_data.backups
            );

            dataProxy.writeQuery({ query, data: { backups } });
          }
        })
      }
    })
  })
)(Backups);