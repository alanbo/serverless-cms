import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom'
import Divider from '@material-ui/core/Divider';

interface MenuLinkProps {
  to: string,
  text: string,
  icon: string
}

const MenuLink = ({ to, text, icon }: MenuLinkProps) => (
  <Link to={to}>
    <ListItem button>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  </Link>
);

export interface DataItem {
  path: string,
  type: string,
  icon: string
}

type MenuListProps = {
  signOut: () => any,
  fragments_list: Array<DataItem>
}


export default ({ signOut, fragments_list }: MenuListProps) => {
  return (
    <div>
      <List component="nav">
        <MenuLink to='/' icon='home' text='Dashboard' />
        <Divider />
        {
          fragments_list.map(({ path, icon, type }) => (
            <MenuLink to={path} icon={icon} text={type} key={type} />
          ))
        }
      </List>
      <Divider />
      <List component="nav">
        <MenuLink to='/trash' icon='delete_outline' text='Trash' />
        <MenuLink to='/backups' icon='backup' text='Backups' />
        <MenuLink to='/settings' icon='settings' text='Settings' />
        <Divider />
        <ListItem button onClick={signOut}>
          <ListItemIcon>
            <Icon>power_settings_new</Icon>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
};
