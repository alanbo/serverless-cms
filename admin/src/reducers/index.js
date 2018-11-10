import { combineReducers } from 'redux';
import imageList from './imageList';
import galleryList from './galleryList';
import textList from './textList';
import menuList from './menuList';
import pageTypeList from './pageTypeList';

const serverless = combineReducers({
  imageList,
  galleryList,
  textList,
  menuList,
  pageTypeList
});

export default serverless;