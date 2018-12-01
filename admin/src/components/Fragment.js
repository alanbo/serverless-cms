import React from 'react';
import fg_config from '../fg-config';

class Fragment extends React.Component {
  render() {
    const type = this.props.match.params.fragment_type;
    const data = fg_config[type];

    if (!data) {
      return <div>The page doesn't exist. Check the configuration file</div>
    }

    return (
      <div>
        <h1>{ data.type }</h1>
      </div>
    );
  }
};

export default Fragment;
