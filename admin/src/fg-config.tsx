import {
  getPageList,
  getGalleryList,
  getMenuList,
  getTextList
} from './graphql/fragment-queries';

interface Config {
  [path: string]: {
    type: string,
    query: string,
    icon: string
  }
}

const config: Config = {
  pages: {
    type: 'Page',
    query: getPageList,
    // input: ,
    icon: 'pages',
  },

  galleries: {
    type: 'Gallery',
    query: getGalleryList,
    // input: ,
    icon: 'photo_library',
  },

  menus: {
    type: 'Menu',
    query: getMenuList,
    // input: ,
    icon: 'menu'
  },

  texts: {
    type: 'Text',
    query: getTextList,
    // input: ,
    icon: 'notes'
  }
}

export default config;