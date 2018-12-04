import { combineReducers } from 'redux';
import pageTypeList from './pageTypeList';
import fragments from './fragments';

const serverless = combineReducers({
  pageTypeList,
  fragments
});

export default serverless;