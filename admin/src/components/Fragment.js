import React from 'react';
import fg_config from '../fg-config';
import { getFragmentList } from '../actions';
import { connect } from 'react-redux';

class Fragment extends React.Component {
  componentWillMount() {
    const type = this.props.match.params.fragment_type;
    const data = fg_config[type];

    this.props.getFragmentList(data.query);
  }

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

function mapStateToProps(state) {
  return {
    fragments: state.fragments
  }
}

export default connect(mapStateToProps, { getFragmentList })(Fragment);
