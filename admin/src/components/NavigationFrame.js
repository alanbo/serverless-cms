// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import styles from './navigation-frame/styles';
import MenuList from './navigation-frame/MenuList';
import type { DataItem } from './navigation-frame/MenuList';
import fg_config from '../fg-config';

const fg_list: Array<DataItem> = Object.keys(fg_config)
  .map(key => {
    const { type, icon } = fg_config[key];

    return { type, icon, path: `/${key}` }
  });

type Props = {
  classes: {
    root: string,
    appBar: string,
    appBarShift: string,
    menuButton: string,
    hide: string,
    flex: string,
    drawerPaper: string,
    drawerPaperClose: string,
    toolbar: string,
    content: string,
  },
  signOut: () => any,
  children: React.Node
}

type State = {
  open: boolean
}

class NavigationFrame extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              serverless cms
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
               <ChevronLeftIcon />
            </IconButton>
          </div>
          <MenuList signOut={this.props.signOut} fragments_list={ fg_list } />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(NavigationFrame);
