import React from 'react';
import { connect } from 'react-redux';
import fg_config from './inputs/input-config';
import { putFragment, removeFragment, resizeImages } from '../actions';
import SaveCancelButtons from './main/common/SaveCancelButtons';
import * as R from 'ramda';
import { FragmentItem, AwsVars, PageTypeConfig } from '../types';
import aws_vars from '../aws-stack-vars';

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
  // something wrong with connect type, add more appropriate type later
  removeFragment: (...args: any) => any,
  resizeImages: (paths: string[], callback: (images: FragmentItem[]) => any) => any,
  fragments: {
    [id: string]: FragmentItem
  },
  page_type_config: PageTypeConfig
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

  resizeImages = (paths, callback) => {
    this.props.resizeImages(paths, callback);
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
            page_type_config={this.props.page_type_config}
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
    //@ts-ignore
    fragments: R.filter(fg => !fg.is_deleted, state.fragments),
    page_type_config: state.page_type_config
  };
}

//@ts-ignore
export default connect(mapStateToProps, { putFragment, removeFragment, resizeImages })(EditFragment);