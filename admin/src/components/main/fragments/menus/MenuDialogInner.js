import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const menu_item_styles = theme => ({
  text_field: {
    width: '40%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  addBtnWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 10
  }
});



class MenuItemUnstyled extends Component {
  state = {
    name_input: null,
    href_input: null
  }

  renderInnerList() {
    const { item, classes } = this.props;

    if (item.items) {
      return (
        <ul>
          {item.items.map((item, i) => <MenuItemUnstyled key={i} item={item} classes={classes} />)}
        </ul>
      );
    }

    return null;
  }

  render() {
    const { item, classes } = this.props;

    return (
      <li>
        <div>
          <TextField
            label='Name'
            value={this.state.name_input || item.name}
            onChange={e => this.setState({ name_input: e.target.value })}
            margin='normal'
            className={classes.text_field}
          />
          <TextField
            label='Url'
            value={this.state.href_input || item.href || ''}
            onChange={e => this.setState({ href_input: e.target.value })}
            margin='normal'
            className={classes.text_field}
          />
        </div>

        {this.renderInnerList()}

        <div className={classes.addBtnWrapper}>
          <Button variant="contained" color="primary" className={classes.button}>
            Add Menu Item
            <AddIcon className={classes.rightIcon}>add</AddIcon>
          </Button>
          <Button variant="contained" color="primary" className={classes.button}>
            Add Inner Mennu
            <AddIcon className={classes.rightIcon}>add</AddIcon>
          </Button>

        </div>
      </li>
    );
  }
}

const MenuItem = withStyles(menu_item_styles)(MenuItemUnstyled);

class MenuDialogInner extends Component {
  state = {
    menu_data: null
  }

  renderItems() {
    const data = this.state.menu_data || this.props.data || {};
    const menu_items = Object.keys(data.items).map(item => data.items[item]);

    return menu_items.map((item, i) => (
      <MenuItem item={item} key={i} />
    ));
  }

  render() {
    const data = this.state.menu_data || this.props.data;

    return (
      <div>
        <ul>
          {this.renderItems()}
        </ul>
      </div>
    )
  }

}

export default MenuDialogInner;