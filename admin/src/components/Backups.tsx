import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import * as R from 'ramda';

const getBackupListQuery = gql`
  query getBackupList {
    backups: getBackupList,
  }
`;

const backupMutation = gql`
  mutation Backup {
    iso_date: backup
  }
`;

const restoreFromBackupMutation = gql`
  mutation RestoreFromBackup($iso_date: String!) {
    success: restoreFromBackup(iso_date: $iso_date)
  }
`;

const deleteBackupsMutation = gql`
  mutation deleteBackups($iso_dates: [String!]!) {
    success: deleteBackups(iso_dates: $iso_dates)
  }
`;

// interface Props {
//   backups: string[] | null;
// }

class Backups extends Component<any> {
  _backupList = () => {
    const { restoreFromBackup, deleteBackups } = this.props;

    console.log(this.props);
    return this.props.backups.map(backup => (
      <div key={backup.toString()}>
        <p >{backup.toString()}</p>
        <button onClick={restoreFromBackup.bind(null, backup)}>restore</button>
        <button onClick={deleteBackups.bind(null, [backup])}>delete</button>
      </div>
    ));
  }

  _restoreBackup = (iso_date) => {
    this.props.mutate({ variables: { iso_date } });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        Hello From Backups
        {this._backupList()}
        <button onClick={this.props.backupData}>Backup</button>
      </div>
    );
  }
}

export default compose(
  graphql(getBackupListQuery, {
    options: {
      fetchPolicy: 'cache-first',
    },

    // @ts-ignore
    props: (props: any) => {
      const backups = (props.data.backups || []).map(backup => {
        const iso_string = R.replace(/(backup\/|(\.zip))/g, '', backup);

        return new Date(iso_string);
      })
      return {
        backups
      }
    }
  }),
  // graphql(backupMutation, {

  // }),
  // @ts-ignore
  graphql(restoreFromBackupMutation, {
    props: (props) => ({
      restoreFromBackup: (iso_date) => {
        // @ts-ignore
        props.mutate({
          variables: { iso_date }
        })
      }
    })

  }),
  // @ts-ignore
  graphql(deleteBackupsMutation, {
    props: (props) => ({
      deleteBackups: (iso_dates: Date[]) => {
        // @ts-ignore
        props.mutate({
          variables: { iso_dates },
          update: (dataProxy, result) => {
            const query = getBackupListQuery;
            const old_data = dataProxy.readQuery({ query });
            const paths = iso_dates.map(iso_date => `backup/${iso_date.toISOString()}.zip`);

            // @ts-ignore
            // @ts-ignore
            const backups = R.without(paths, old_data.backups);

            dataProxy.writeQuery({ query, data: { backups } });
          }
        })

      }

    })

  }),
  graphql(backupMutation, {
    props: (props) => ({
      backupData: () => {
        // @ts-ignore
        props.mutate({
          update: (dataProxy, result) => {
            const query = getBackupListQuery;
            const old_data = dataProxy.readQuery({ query });

            // @ts-ignore
            const path = `backup/${result.data.iso_date}.zip`;

            // @ts-ignore
            const backups = R.append(path, old_data.backups);

            dataProxy.writeQuery({ query, data: { backups } });
          }
        })

      }

    })

  })
)(Backups);