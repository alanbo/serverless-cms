// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import ListTable from './main/common/ListTable';
import { connect } from 'react-redux';
import { removeFragment } from '../actions/index';
import { withRouter } from 'react-router-dom';
import styles from './main/common/btn_styles';

type Props = {
  fragments: { name: String, id: String, number?: Number }[],
  removeFragment: (id: String) => void,
  editFragment: (id: String) => void,
  addFragment: (id: String) => void,
  classes: { button: String }
};

class FragmentList extends Component<Props> {
  onDelete = id => {
    this.props.removeFragment(id);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1>Photos</h1>
        <ListTable data={this.props.fragments} onDelete={ id => this.onDelete(id)} />
        <Button variant="fab" color="primary" aria-label="add" className={classes.button} onClick={console.log}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const fg_type = 'Text'.toLowerCase();

  const fragments = Object.keys(state.fragments)
    .map(key => state.fragments[key])
    .filter(({ type }) => type === fg_type );
  
  return {
    fragments
  }
}

export default withRouter(connect(mapStateToProps, { removeFragment })(withStyles(styles)(FragmentList)));
