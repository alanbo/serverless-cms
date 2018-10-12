import { combineReducers } from 'redux';
import imageList from './imageList';
import galleryList from './galleryList';

const serverless = combineReducers({
  imageList,
  galleryList
});

export default serverless;