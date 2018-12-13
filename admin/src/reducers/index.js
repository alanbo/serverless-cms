import { combineReducers } from 'redux';
import pageTypeList from './pageTypeList';
import fragments from './fragments';

const serverless = combineReducers({
  page_type_config: pageTypeList,
  fragments
});

export default serverless;