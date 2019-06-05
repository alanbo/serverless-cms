import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './Home';
import Trash from './main/Trash'
import Settings from './main/Settings'
import Fragment from './Fragment';
import EditFragment from './EditFragment';
import Backups from './Backups';


const Main = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route path='/trash' component={Trash} />
    <Route path='/settings' component={Settings} />
    <Route path='/backups' component={Backups} />
    <Route path='/:fragment_type/:id' component={EditFragment} />
    <Route path='/:fragment_type' component={Fragment} />
  </Switch>
);

export default Main;
