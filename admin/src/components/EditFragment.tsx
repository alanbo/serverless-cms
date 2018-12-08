import React from 'react';
import { connect } from 'react-redux';
import fg_config from '../fg-config';
import { putFragment, removeFragment, resizeImages } from '../actions';
import SaveCancelButtons from './main/common/SaveCancelButtons';
import * as R from 'ramda';
import { FragmentItem, AwsVars } from '../types';
import aws_vars from '../aws-stack-vars';
import { Storage } from 'aws-amplify';

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
  removeFragment: (id: string) => any,
  resizeImages: (paths: string[]) => any,
  fragments: {
    [id: string]: FragmentItem
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

  static getDerivedStateFromProps(props, state) {
    if (!Object.keys(state.input).length) {
      const { fragment_type, id } = props.match.params;
      const config = fg_config[fragment_type];
      let input = props.input_data;

      if (Object.keys(input).length && typeof config.transformer === 'function') {
        input = config.transformer(input);
      }

      return {
        input
      };
    }

    return null;
  }

  resizeImages = paths => {
    this.props.resizeImages(paths);
  }

  render() {
    const { fragment_type, id } = this.props.match.params;
    const config = fg_config[fragment_type];
    const is_new = id === 'add_new';
    const Input = config.input as React.FunctionComponent<any> | React.ComponentClass<any>;
    let input_data = this.state.input;

    if (Input && config && id || is_new) {
      return (
        <div>
          <h1>{`${is_new ? 'Add' : 'Edit'} ${config.type}`}</h1>
          <Input
            onChange={(input, callback) => this.setState({ input }, callback)}
            value={input_data || {}}
            fragments={this.props.fragments}
            aws_vars={aws_vars as AwsVars}
            resizeImages={this.resizeImages}
          />
          <SaveCancelButtons
            onSave={() => {
              this.props.putFragment(this.state.input, config.type);
              this.props.history.push(`/${fragment_type}`);
            }}
            onCancel={() => this.props.history.push(`/${fragment_type}`)}
          />
        </div>
      );
    }

    return <div>The page doesn't exist. Check the configuration file</div>
  }
};

function mapStateToProps(state, props) {
  const id = props.match.params.id;
  const input_data = R.dissoc('lastModified', R.dissoc('type', state.fragments[id]));

  return {
    input_data,
    fragments: state.fragments
  };
}

export default connect(mapStateToProps, { putFragment, removeFragment, resizeImages })(EditFragment);