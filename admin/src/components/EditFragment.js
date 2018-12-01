import React from 'react';
import fg_config from '../fg-config';

class EditFragment extends React.Component {
  render() {
    const { fragment_type, id } = this.props.match.params;
    const data = fg_config[fragment_type];
    const is_new = id === 'add_new';

    if (!data || !id || !is_new) {
      return <div>The page doesn't exist. Check the configuration file</div>
    }

    return (
      <div>
        <h1>E{ data.type }</h1>
      </div>
    );
  }
};

export default EditFragment;