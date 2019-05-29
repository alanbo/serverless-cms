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
    backups: getBackupList {
      id
      lastModified
      size
      url 
    },
  }
`;

export const backupMutation = gql`
  mutation Backup {
    backup {
      id
      lastModified
      size
      url
    }
  }
`;

export const restoreFromBackupMutation = gql`
  mutation RestoreFromBackup($id: ID!) {
    success: restoreFromBackup(id: $id)
  }
`;

export const deleteBackupsMutation = gql`
  mutation DeleteBackups($ids: [ID!]!) {
    success: deleteBackups(ids: $ids)
  }
`;


export default compose(
  graphql<{}, GetBackupList, void, GetBackupList>(getBackupListQuery),

  graphql<{}, RestoreFromBackup, RestoreFromBackupVariables, { restoreFromBackup(iso_date: string) }>(restoreFromBackupMutation, {
    props: (props) => ({
      restoreFromBackup: (id) => {
        props.mutate!({
          variables: { id }
        })
      }
    })
  }),

  graphql<{}, DeleteBackups, DeleteBackupsVariables, { deleteBackups(iso_dates: string[]) }>(deleteBackupsMutation, {
    props: (props) => ({
      deleteBackups: (ids: string[]) => {
        props.mutate!({
          variables: { ids },
          update: (dataProxy, result) => {
            const query = getBackupListQuery;

            if (!result.data) {
              return;
            }

            const old_data = dataProxy.readQuery<GetBackupList>({ query });

            if (!old_data) {
              return;
            }

            const backups = old_data.backups.filter(backup => !ids.includes(backup.id));

            dataProxy.writeQuery<GetBackupList>({ query, data: { backups } });
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

            if (!old_data || !result.data.backup) {
              return;
            }

            const backups = R.append(
              result.data.backup,
              old_data.backups
            );

            dataProxy.writeQuery({ query, data: { backups } });
          }
        })
      }
    })
  })
)(Backups);