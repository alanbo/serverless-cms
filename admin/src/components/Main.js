import React from 'react';
import { Switch, Route } from 'react-router-dom'
import { Home, Pages, Blog, Photos, Fragments, Thrash, Settings, GallerySection } from './main/index'
import EditPage from './main/pages/EditPage';
import Fragment from './Fragment';
import EditFragment from './EditFragment';

const Main = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route path='/thrash' component={Thrash} />
    <Route path='/settings' component={Settings} />
    <Route path='/:fragment_type/:id' component={EditFragment}/>
    <Route path='/:fragment_type' component={Fragment}/>
  </Switch>
)

export default Main;
