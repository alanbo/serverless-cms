import React, { Component } from 'react';
import Tabs from './common/Tabs';
import RichTexts from './fragments/RichTexts';
import Texts from './fragments/Texts';
import Menus from './fragments/Menus';
import All from './fragments/All';


const Fragments = () => {
  return (<div>
    <h1>Fragments</h1>
    <Tabs titles={ ['Texts', 'Rich Texts', 'Menus', 'All'] }>
      <Texts />
      <RichTexts />
      <Menus />
      <All />
    </Tabs>
  </div>);
};

export { Fragments };
