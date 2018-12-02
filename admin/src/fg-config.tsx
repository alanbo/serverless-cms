import * as React from 'react';
import {
  getPageList,
  getGalleryList,
  getMenuList,
  getTextList
} from './graphql/fragment-queries';

interface InputProps {
  onChange: () => any,
  input: {
    id?: string,
    name?: string,
    [element: string]: any
  }
}

interface Config {
  [path: string]: {
    type: string,
    query: string,
    icon: string,
    input: React.FunctionComponent<InputProps> | React.ComponentClass<InputProps>
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
    input: (props: InputProps) => <div>galleries input</div>,
    icon: 'photo_library',
  },

  menus: {
    type: 'Menu',
    query: getMenuList,
    input: (props: InputProps) => <div>menu input</div>,
    icon: 'menu'
  },

  texts: {
    type: 'Text',
    query: getTextList,
    input: (props: InputProps) => <div>texts input</div>,
    icon: 'notes'
  }
}

export default config;