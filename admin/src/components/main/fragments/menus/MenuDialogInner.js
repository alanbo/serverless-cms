import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import * as R from 'ramda';

import MenuItem from './MenuItem';
import { isNameEmpty, getUpdatedMenuData, getDissocMenuData, NEW_ITEM } from './helpers';
import menu_item_styles from './menu-dialog-inner-styles';


class MenuDialogInner extends Component {
  state = {
    menu_data: null,
    menu_index_path: []
  }

  updatePath = (menu_index_path, errCallback = () => { }) => {
    const old_path = this.state.menu_index_path;
    const data = this.state.menu_data || this.props.data || {};
    const is_name_empty = isNameEmpty(old_path, data);

    // run error callback if the name is empty
    if (is_name_empty) {
      this.setState({ empty_name_path: old_path });
      // only allow index path change if the currently open item has its name filled
    } else {
      this.setState({ menu_index_path, empty_name_path: null });
    }
  }

  updateMenuData = (path, prop_name, value) => {
    const data = this.state.menu_data || this.props.data || {};
    const menu_data = getUpdatedMenuData(path, prop_name, value, data);

    // clears out empty name error if the error path item name is filled with at least one char
    if (prop_name === 'name' && R.equals(path, this.state.empty_name_path) && value.length) {
      this.setState({ empty_name_path: null, menu_data });
    } else {
      this.setState({ menu_data });
    }
  }

  deleteItem = path => {
    const data = this.state.menu_data || this.props.data || {};
    const menu_data = getDissocMenuData(path, data);

    // update menu_data with removed item and move the current path one level lower.
    this.setState({ menu_data, menu_index_path: R.init(this.state.menu_index_path) });
  }

  renderItems() {
    const data = this.state.menu_data || this.props.data || {};

    const root_passtrhough = {
      current_index_path: this.state.menu_index_path,
      updatePath: this.updatePath,
      updateMenuData: this.updateMenuData,
      empty_name_path: this.state.empty_name_path,
      deleteItem: this.deleteItem,
      classes: this.props.classes
    }

    // converts an object of menu items into an array
    const menu_items = Object.keys(data.items || {}).map(item => data.items[item]);

    return menu_items.map((item, i) => (
      <MenuItem
        item={item}
        key={i}
        index_path={[i]}
        root={root_passtrhough}
      />
    ));
  }

  render() {
    const data = this.state.menu_data || this.props.data;
    const { classes } = this.props;

    return (
      <div>
        <ul className={classes.list}>
          {this.renderItems()}
        </ul>
        {
          // only display button when at the lowest level of expansion
          !this.state.menu_index_path.length
            ? (
              <div className={classes.addBtnWrapper}>
                <Button
                  color="primary"
                  variant="fab"
                  aria-label="Add"
                  className={classes.button} mini
                  onClick={() => {
                    const menu_data = R.pipe(
                      R.append(NEW_ITEM),
                      R.assocPath(['items'], R.__, data)
                    )(data.items || []);

                    this.setState({ menu_data }, () => {
                      this.updatePath([menu_data.items.length - 1]);
                    });
                  }}
                >
                  <AddIcon />
                </Button>
              </div>
            ) : null
        }
      </div>
    )
  }

}

export default withStyles(menu_item_styles)(MenuDialogInner);