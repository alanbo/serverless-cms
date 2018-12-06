import * as React from 'react';
import {
  getPageList,
  getGalleryList,
  getMenuList,
  getTextList
} from './graphql/fragment-queries';

import TextInput from './components/inputs/texts/TextInput';
import MenuInput from './components/inputs/menus/MenuInput';
import GalleryInput from './components/inputs/galleries/GalleryInput';

import { InputProps } from './types';


interface Config {
  [path: string]: {
    type: string,
    query: string,
    icon: string,
    input: React.FunctionComponent<any> | React.ComponentClass<any>
  }
}

const config: Config = {
  pages: {
    type: 'Page',
    query: getPageList,
    input: (props: InputProps) => <div>this is input</div>,
    icon: 'pages',
  },

  galleries: {
    type: 'Gallery',
    query: getGalleryList,
    input: GalleryInput,
    icon: 'photo_library',
  },

  menus: {
    type: 'Menu',
    query: getMenuList,
    input: MenuInput,
    icon: 'menu'
  },

  texts: {
    type: 'Text',
    query: getTextList,
    input: TextInput,
    icon: 'notes'
  }
}

export default config;