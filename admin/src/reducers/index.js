import { combineReducers } from 'redux';
import imageList from './imageList';
import galleryList from './galleryList';
import textList from './textList';
import menuList from './menuList';
import pageTypeList from './pageTypeList';
import pageList from './pageList';

const serverless = combineReducers({
  imageList,
  galleryList,
  textList,
  menuList,
  pageTypeList,
  pageList
});

export default serverless;