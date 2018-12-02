import React from 'react';
import FragmentList from './FragmentList';
import fg_config from '../fg-config';
import { getFragmentList } from '../actions';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FragmentItem } from '../types';


interface MatchFgType {
  match: {
    params: {
      fragment_type: string;
    }
  }
}

interface Props extends MatchFgType {
  fragments: Array<FragmentItem>
}

interface Fragments {
  [id: string]: FragmentItem
}

interface FgState {
  fragments: Fragments
}

const selectFragments: (state: FgState) => Fragments = state => state.fragments;
const selectTypeFromRoute: (state: FgState, props: MatchFgType) => string = (state, props) => props.match.params.fragment_type;

const getFragmentsByType = createSelector(
  [selectFragments, selectTypeFromRoute], (fragments, route_type) => {
    const type = fg_config[route_type].type;

    return Object.keys(fragments)
      .map(key => fragments[key])
      .filter(item => item.type === type);
  }
);


class Fragment extends React.Component<Props> {
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
          addFragment={console.log}
          removeFragment={console.log}
          editFragment={console.log}
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

export default connect(mapStateToProps, { getFragmentList })(Fragment);
