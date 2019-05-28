import React, { Component } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import { createSelector } from 'reselect';

import * as R from 'ramda';

import MenuItem from './MenuItem';
import { isNameEmpty, getUpdatedMenuData, getDissocMenuData, NEW_ITEM } from './helpers';
import menu_styles from './menu-styles';
import { Item } from './types';
import { FragmentItem, Fragments, FgState } from '../../../types';

const selectFragments = R.identity;

const getPageFragments = createSelector(
  [selectFragments], fragments => {
    return R.pipe(
      // @ts-ignore
      R.values(),
      // @ts-ignore
      R.filter(fg => fg.type === 'Page'),
      R.map(page => ({
        // @ts-ignore
        label: page.name,
        // @ts-ignore
        value: `/${page.name.replace(/(\W+$)|(^\W+)/g, '').replace(/\W+/g, "_")}`
      }))
    )(fragments)
  }
);


interface Props extends WithStyles<typeof menu_styles> {
  value: Item,
  onChange: (value: Item, callback?: () => any) => any,
  fragments: FragmentItem[]
}

interface State {
  menu_index_path: number[],
  empty_name_path: number[] | null
}


class MenuInput extends Component<Props, State> {
  state = {
    // menu_data: null,
    menu_index_path: [],
    empty_name_path: null
  }

  updatePath = (menu_index_path, errCallback = () => { }) => {
    const data = this.props.value || NEW_ITEM;
    const old_path = this.state.menu_index_path;
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
    const data = this.props.value || NEW_ITEM;
    const menu_data = getUpdatedMenuData(path, prop_name, value, data);

    // clears out empty name error if the error path item name is filled with at least one char
    if (prop_name === 'name' && R.equals(path, this.state.empty_name_path) && value.length) {
      this.setState({ empty_name_path: null });
    }

    this.props.onChange(menu_data);
  }

  deleteItem = path => {
    const data = this.props.value || NEW_ITEM;
    const menu_data = getDissocMenuData(path, data);

    // update menu_data with removed item and move the current path one level lower.
    this.setState({ menu_index_path: R.init(this.state.menu_index_path) });
    this.props.onChange(menu_data);
  }

  renderItems() {
    const data = this.props.value || NEW_ITEM;

    const root_passtrhough = {
      current_index_path: this.state.menu_index_path,
      updatePath: this.updatePath,
      updateMenuData: this.updateMenuData,
      empty_name_path: this.state.empty_name_path,
      deleteItem: this.deleteItem,
      classes: this.props.classes,
      pages: getPageFragments(this.props.fragments)
    }

    if (!data.items) {
      return;
    }

    // converts an object of menu items into an array
    // const menu_items = Object.keys(data.items || {}).map(item => data.items[item]);

    return data.items.map((item, i) => (
      <MenuItem
        item={item}
        key={i}
        index_path={[i]}
        root={root_passtrhough}
      />
    ));
  }

  updateName = e => {
    const data = this.props.value || NEW_ITEM;
    this.props.onChange(R.assoc('name', e.target.value, data));
  }

  render() {
    const data = this.props.value || NEW_ITEM;
    const { classes } = this.props;
    const is_name_empty = data.name ? !data.name.length : false;

    return (
      <div>
        <TextField
          value={data.name || ''}
          onChange={this.updateName}
          required
          label={is_name_empty ? 'Name can\'t be empty' : 'Menu Name'}
          error={is_name_empty}
          className={classes.nameField}
          placeholder='Menu name'

        />
        <ul className={classes.list}>
          {this.renderItems()}
        </ul>
        {
          // only display button when at the lowest level of expansion
          !this.state.menu_index_path.length
            ? (
              <div className={classes.addBtnWrapper}>
                <Fab
                  color="primary"
                  size='small'
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    const menu_data = R.pipe(
                      // @ts-ignore
                      R.append(NEW_ITEM),
                      R.assocPath(['items'], R.__, data)
                    )(data.items || []);

                    this.props.onChange(menu_data, () => {
                      this.updatePath([menu_data.items.length - 1]);
                    });
                  }}
                >
                  <AddIcon />
                </Fab>
              </div>
            ) : null
        }
      </div >
    )
  }

}

export default withStyles(menu_styles)(MenuInput);