import {
  getPageList,
  getGalleryList,
  getMenuList,
  getTextList
} from './graphql/fragment-queries';

export default {
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