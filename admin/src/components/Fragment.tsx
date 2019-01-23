import React from 'react';
import FragmentList from './FragmentList';
import fg_config from './inputs/input-config';
import { removeFragment } from '../actions';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FragmentItem, Fragments, FgState } from '../types';


interface MatchFgType {
  match: {
    params: {
      fragment_type: string;
    }
  }
  history: {
    push: (path: string) => any
  }
}

interface Props extends MatchFgType {
  fragments: Array<FragmentItem>
  // something wrong with connect type, add more appropriate type later
  removeFragment: (...args: any) => any,
}

const selectFragments: (state: FgState) => Fragments = state => state.fragments;
const selectTypeFromRoute: (state: FgState, props: MatchFgType) => string = (state, props) => props.match.params.fragment_type;

const getFragmentsByType = createSelector(
  [selectFragments, selectTypeFromRoute], (fragments, route_type) => {

    const type_config = fg_config[route_type];

    if (!type_config) {
      return [];
    }

    const type = type_config.type;

    return Object.keys(fragments)
      .map(key => fragments[key])
      .filter(item => item.type === type && !item.is_deleted)
      .sort((a, b) => (b.lastModified - a.lastModified));
  }
);


class Fragment extends React.Component<Props> {
  addFragment = () => {
    const type = this.props.match.params.fragment_type;
    this.props.history.push(`/${type}/add_new`)
  }

  render() {
    const type = this.props.match.params.fragment_type;
    const data = fg_config[type];

    if (!data) {
      return <div>The page doesn't exist. Check the configuration file</div>
    }

    return (
      <div>
        <h1>{data.type}</h1>
        <FragmentList
          addFragment={this.addFragment}
          removeFragment={this.props.removeFragment}
          fragments={this.props.fragments}
          type_path={type}
        />

      </div>
    );
  }
};
function mapStateToProps(state: FgState, props: MatchFgType) {
  const fragments = getFragmentsByType(state, props);

  return {
    fragments
  }
}

export default connect(mapStateToProps, { removeFragment })(Fragment);
