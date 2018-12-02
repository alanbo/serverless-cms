import React from 'react';
import fg_config from '../fg-config';

interface Props {
  match: {
    params: {
      fragment_type: string,
      id?: string
    }
  }
}

interface State {
  input: {
    [field: string]: any
  }
}

class EditFragment extends React.Component<Props, State> {
  state = {
    input: {}
  }

  render() {
    const { fragment_type, id } = this.props.match.params;
    const data = fg_config[fragment_type];
    const is_new = id === 'add_new';
    const Input = data.input;

    if (data && id || is_new) {
      return (
        <div>
          <h1>Edit {data.type}</h1>
          <Input onChange={console.log} input={{ id: 'data' }} />
        </div>
      );
    }

    return <div>The page doesn't exist. Check the configuration file</div>
  }
};

export default EditFragment;