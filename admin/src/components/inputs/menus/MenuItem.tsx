import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import indigo from '@material-ui/core/colors/indigo';
import Fab from '@material-ui/core/Fab';
import * as R from 'ramda';

import { NEW_ITEM, isOnPath } from './helpers';

import { Item } from './types';
import styles from './menu-styles';
import { WithStyles } from '@material-ui/core';

import AutocompleteSelect from '../../main/common/AutocompleteSelect';

interface Root extends WithStyles<typeof styles> {
  current_index_path: number[],
  empty_name_path: number[] | null,
  updateMenuData: (path: number[], property: string, value: string) => any,
  updatePath: (path: number[]) => any,
  deleteItem: (path: number[]) => any,
  pages: Array<{ label: string, value: string }>
}

interface Props {
  item: Item,
  root: Root,
  index_path: number[]
}

interface State {
  name_err_text: string | null;
}


class MenuItem extends Component<Props, State> {
  state = {
    name_err_text: null
  }

  renderInnerList() {
    const {
      item,
      root,
      index_path
    } = this.props;

    if (item.items) {
      return (
        <Paper component='menu' className={root.classes.list}>
          {item.items.map((item, i) => (
            <MenuItem
              key={i}
              item={item}
              index_path={[...index_path, i]}
              root={root}
            />
          ))}
        </Paper>
      );
    }

    return null;
  }

  onExpandChange = () => {
    const {
      index_path,
      root: {
        current_index_path,
        updatePath
      }
    } = this.props;

    // if expanded element is on path
    if (isOnPath(index_path, current_index_path)) {
      const new_path = [...index_path];

      // go one level lower when already expanded element is clicked again
      new_path.pop();

      // root component will run a callback if it detects an empty name
      updatePath(new_path);
    } else {
      updatePath(index_path);
    }
  }

  render() {
    const {
      item: { name, href = '', items = [] },
      index_path,
      root: {
        updateMenuData,
        current_index_path,
        updatePath,
        empty_name_path,
        deleteItem,
        classes,
        pages
      }
    } = this.props;


    // check if the path of the element is on the path of the topmost expanded element
    // makes sure that the parent is not closed while its descandant is currently expanded
    const on_path = isOnPath(index_path, current_index_path);
    const is_current_path = R.equals(current_index_path, index_path);
    const is_name_empty = R.equals(empty_name_path, index_path);

    return (
      <li>
        <ExpansionPanel
          // darkens the color depending on how deeply nested the element is
          style={{ backgroundColor: indigo[100 * index_path.length] }}
          className={classes.expansionPanel}
          expanded={on_path}
          onChange={() => this.onExpandChange()}
          classes={{
            root: classes.visible
          }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            <Paper className={classes.textFieldsWrapper}>
              <TextField
                label={is_name_empty ? 'Fill out the name' : 'Name'}
                value={name}
                error={is_name_empty}
                onChange={e => {
                  // if empty name error, clear it on first change
                  if (this.state.name_err_text) {
                    this.setState({ name_err_text: null });
                  }

                  updateMenuData(index_path, 'name', e.target.value);
                }}
                margin='normal'
                className={classes.text_field}
              />

              <AutocompleteSelect
                options={pages}
                onChange={val => updateMenuData(index_path, 'href', val.value)}
                value={R.find(R.propEq('value', href), pages)}
                placeholder='Choose a page'
              />
            </Paper>

            {this.renderInnerList()}

            <div className={classes.addBtnWrapper}>
              {
                // if depth greater than 4 do not allow adding more nested lists
                // only display button for currently expanded element
                is_current_path
                  ? (
                    <Fab
                      color="secondary"
                      aria-label="Delete"
                      className={classes.button}
                      size='small'
                      onClick={e => deleteItem(index_path)}
                    >
                      <DeleteIcon />
                    </Fab>
                  ) : null
              }
              {
                // if depth greater than 4 do not allow adding more nested lists
                // only display button for currently expanded element
                index_path.length < 4 && is_current_path && name.length
                  ? (
                    <Fab
                      color="primary"
                      aria-label="Add"
                      className={classes.button}
                      size='small'
                      onClick={e => {
                        // appends the new item to the list of items
                        // @ts-ignore
                        const new_items = R.append(NEW_ITEM, items);

                        // updates menu data to include new item
                        updateMenuData(index_path, 'items', new_items);

                        // expands newly created item
                        updatePath(R.append(new_items.length - 1, index_path));
                      }}
                    >
                      <AddIcon />
                    </Fab>
                  ) : null
              }
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </li>
    );
  }
}

export default MenuItem;