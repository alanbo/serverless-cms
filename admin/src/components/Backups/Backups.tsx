import React, { Component } from 'react';

interface Props {
  restoreFromBackup: (iso_string: string) => void,
  deleteBackups: (iso_string: string[]) => void,
  backups: string[],
  backupData: () => void
}

class Backups extends Component<Props> {
  _backupList = () => {
    const { restoreFromBackup, deleteBackups } = this.props;

    return this.props.backups.map(backup => (
      <div key={backup}>
        <p >{backup}</p>
        <button onClick={restoreFromBackup.bind(null, backup)}>restore</button>
        <button onClick={deleteBackups.bind(null, [backup])}>delete</button>
      </div>
    ));
  }

  render() {
    return (
      <div>
        Hello From Backups
        {this._backupList()}
        <button onClick={this.props.backupData}>Backup</button>
      </div>
    );
  }
}

export default Backups;