import React, { Component } from 'react';
import FolderTable from './common/ListTable';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/index';
import AddButton from './common/AddButton';

class PagesComponent extends Component {
  onDelete = id => {
    this.props.removePage(id);
    console.log(id);
  }

  addNewPage = () => this.props.history.push('/pages/add_new_page');

  render() {
    const { pages } = this.props;


    console.log(this.props.history);

    return (
      <div>
        <h1>Pages</h1>
        <FolderTable data={pages} onDelete={({ id }) => this.onDelete(id)} root_path="pages" />
        <AddButton onClick={this.addNewPage} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pages: Object.keys(state.pageList).map(id => state.pageList[id])
  }
}

const Pages = connect(mapStateToProps, actionCreators)(PagesComponent);

export { Pages };
