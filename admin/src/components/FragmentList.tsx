// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import ListTable from './main/common/ListTable';
import styles from './main/common/btn_styles';
import { FragmentItem } from '../types';

interface Props {
  fragments: FragmentItem[],
  removeFragment: (id: String) => void,
  editFragment: (id: String) => void,
  addFragment: () => void,
  classes: { button: string }
};

class FragmentList extends Component<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <ListTable data={this.props.fragments} onDelete={this.props.removeFragment} />
        <Button variant="fab" color="primary" aria-label="add" className={classes.button} onClick={console.log}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(FragmentList);
