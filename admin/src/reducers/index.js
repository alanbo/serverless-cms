import { combineReducers } from 'redux';
import imageList from './imageList';
import galleryList from './galleryList';
import textList from './textList';

const serverless = combineReducers({
  imageList,
  galleryList,
  textList
});

export default serverless;