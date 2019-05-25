import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const getBackupListQuery = gql`
  query getBackupList {
    backups: getBackupList
  }
`;

// interface Props {
//   backups: string[] | null;
// }

class Backups extends Component<any> {
  _backupList = () => {
    console.log(this.props);
    return this.props.backups.map(backup => (
      <p key={backup}>{backup}</p>
    ));
  }

  render() {
    // console.log(this.props.backups);
    return (
      <div>
        Hello From Backups
        {this._backupList()}
      </div>
    );
  }
}

export default graphql(getBackupListQuery, {
  options: {
    fetchPolicy: 'cache-first',
  },

  // @ts-ignore
  props: (props: any) => {
    console.log(props);
    return {
      backups: props.data.backups ? props.data.backups : []
    }
  }
})(Backups);