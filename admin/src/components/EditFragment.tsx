import React from 'react';
import { connect } from 'react-redux';
import fg_config from '../fg-config';
import { putFragment, removeFragment } from '../actions';
import SaveCancelButtons from './main/common/SaveCancelButtons';

interface Props {
  match: {
    params: {
      fragment_type: string,
      id?: string
    }
  },
  history: {
    push: (path: string) => any
  },
  putFragment: (input: any, type: string) => any,
  removeFragment: (id: string) => any
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
          <h1>{`${is_new ? 'Add' : 'Edit'} ${data.type}`}</h1>
          <Input onChange={input => this.setState({ input })} value={this.state.input} />
          <SaveCancelButtons
            onSave={() => this.props.putFragment(this.state.input, data.type)}
            onCancel={() => this.props.history.push(`/${fragment_type}`)}
          />
        </div>
      );
    }

    return <div>The page doesn't exist. Check the configuration file</div>
  }
};

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps, { putFragment, removeFragment })(EditFragment);