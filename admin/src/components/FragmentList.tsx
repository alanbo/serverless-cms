import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ListTable from './main/common/ListTable';
import styles from './main/common/btn_styles';
import { FragmentItem } from '../types';

interface Props {
  fragments: FragmentItem[],
  removeFragment: (id: string) => any,
  addFragment: () => void,
  type_path: string,
  classes: { button: string }
};

class FragmentList extends Component<Props> {
  render() {
    const { classes, type_path } = this.props;

    return (
      <div>
        <ListTable data={this.props.fragments} onDelete={this.props.removeFragment} type_path={type_path} />
        <Fab color="primary" aria-label="add" className={classes.button} onClick={this.props.addFragment}>
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(FragmentList);
