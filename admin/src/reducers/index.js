import { combineReducers } from 'redux';
import imageList from './imageList';
import galleryList from './galleryList';
import textList from './textList';
import menuList from './menuList';

const serverless = combineReducers({
  imageList,
  galleryList,
  textList,
  menuList
});

export default serverless;