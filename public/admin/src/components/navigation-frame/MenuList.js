import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom'
import Divider from '@material-ui/core/Divider';

export default ({ signOut }) => {
  return (
    <div>
      <List component="nav">
        <Link to='/'>
          <ListItem button>
            <ListItemIcon>
              <Icon>home</Icon>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        <Divider />
        <Link to='/pages'>
          <ListItem button>
            <ListItemIcon>
              <Icon>pages</Icon>
            </ListItemIcon>
            <ListItemText primary="Pages" />
          </ListItem>
        </Link>
        <Link to='/blog'>
          <ListItem button>
            <ListItemIcon>
              <Icon>recent_actors</Icon>
            </ListItemIcon>
            <ListItemText primary="Blog" />
          </ListItem>
        </Link>
        <Link to='/photos'>
          <ListItem button>
            <ListItemIcon>
              <Icon>photo_library</Icon>
            </ListItemIcon>
            <ListItemText primary="Photos" />
          </ListItem>
        </Link>
        <Link to='/fragments'>
          <ListItem button>
            <ListItemIcon>
              <Icon>widgets</Icon>
            </ListItemIcon>
            <ListItemText primary="Fragments" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List component="nav">
        <Link to='/thrash'>
          <ListItem button>
            <ListItemIcon>
              <Icon>delete_outline</Icon>
            </ListItemIcon>
            <ListItemText primary="Thrash" />
          </ListItem>
        </Link>
        <Link to='/settings'>
          <ListItem button>
            <ListItemIcon>
              <Icon>settings</Icon>
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
        <Divider />
        <ListItem button onClick={ signOut }>
          <ListItemIcon>
            <Icon>power_settings_new</Icon>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
};
