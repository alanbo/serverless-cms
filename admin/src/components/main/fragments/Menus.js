import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../../actions/index';
import TextList from './common/TextList';

class Menus extends Component {
  render() {
    return (
      <div>
        <TextList data={this.props.menus} onEdit={this.props.onEdit} removeItem={this.props.removeMenu} />
      </div>
    );
  }
}

function mapStateToProps(state) {

  const menus = Object
    .keys(state.menuList)
    .map(id => state.menuList[id]);

  return {
    menus
  }
}

export default connect(mapStateToProps, actionCreators)(Menus);
