import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import teal from '@material-ui/core/colors/teal';
import indigo from '@material-ui/core/colors/indigo';

const menu_item_styles = theme => ({
  text_field: {
    width: '100%',
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
  },

  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  list: {
    padding: 0,
    listStyleType: 'none',
    padding: 20,
    marginBottom: 20
  },

  expansionPanel: {
    marginTop: 20,
    marginBottom: 20,
  },

  expansionPanelDetails: {
    display: 'block'
  },

  textFieldsWrapper: {
    padding: 20,
    marginBottom: 20
  }
});


class MenuItemUnstyled extends Component {
  state = {
    name_input: null,
    href_input: null,
  };

  prev_path = [];

  isOnPath(path, current_path) {
    let on_path = true;

    path.forEach((item, i) => {
      if (item !== current_path[i]) {
        on_path = false;
      }
    });

    return on_path;
  }

  renderInnerList(path) {
    const { item, classes, current_path, updatePath } = this.props;

    if (item.items) {
      return (
        <Paper component='ul' className={classes.list}>
          {item.items.map((item, i) => (
            <MenuItemUnstyled
              prev={path}
              key={i}
              item={item}
              classes={classes}
              updatePath={updatePath}
              current_path={current_path}
            />
          ))}
        </Paper>
      );
    }

    return null;
  }

  onExpandChange = (path) => {
    if (this.prev_path.join() === path.join()) {
      const new_path = [...path];
      new_path.pop();

      this.props.updatePath(new_path);
      this.prev_path = [];
    } else {
      this.props.updatePath(path);
      this.prev_path = path;
    }
  }

  render() {
    const { item, classes, current_path, updatePath } = this.props;
    const name = this.state.name_input || item.name;
    const href = this.state.href_input || item.href || '';
    const prev = this.props.prev || [];
    const path = [...prev, item.name];
    const on_path = this.isOnPath(path, current_path);

    if (!on_path) {
      this.prev_path = [];
    }

    return (
      <li>
        <ExpansionPanel
          style={{ backgroundColor: indigo[100 * path.length] }}
          className={classes.expansionPanel}
          expanded={on_path}
          onChange={() => this.onExpandChange(path)}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{`/ ${path.join(' / ')}`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            <Paper className={classes.textFieldsWrapper}>
              <TextField
                label='Name'
                value={name}
                onChange={e => this.setState({ name_input: e.target.value })}
                margin='normal'
                className={classes.text_field}
              />
              <TextField
                label='Url'
                value={href}
                onChange={e => this.setState({ href_input: e.target.value })}
                margin='normal'
                className={classes.text_field}
              />
            </Paper>

            {this.renderInnerList(path)}

            {
              // if depth greater than 4 do not allow adding more nested lists
              path.length < 4
                ? (
                  <div className={classes.addBtnWrapper}>
                    <Button color="primary" variant="fab" aria-label="Add" className={classes.button} mini>
                      <AddIcon />
                    </Button>
                  </div>
                ) : null
            }
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </li>
    );
  }
}

const MenuItem = withStyles(menu_item_styles)(MenuItemUnstyled);



class MenuDialogInner extends Component {
  state = {
    menu_data: null,
    menu_path: []
  }

  updatePath = menu_path => {
    this.setState({ menu_path });
    console.log(menu_path);
  }

  renderItems() {
    const data = this.state.menu_data || this.props.data || {};
    const menu_items = Object.keys(data.items).map(item => data.items[item]);

    return menu_items.map((item, i) => (
      <MenuItem item={item} key={i} current_path={this.state.menu_path} updatePath={this.updatePath} />
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
        <div className={classes.addBtnWrapper}>
          <Button color="primary" variant="fab" aria-label="Add" className={classes.button} mini>
            <AddIcon />
          </Button>
        </div>
      </div>
    )
  }

}

export default withStyles(menu_item_styles)(MenuDialogInner);