import { combineReducers } from 'redux';
import pageTypeList from './pageTypeList';
import fragments from './fragments';
import notification from './notification';
import settings from './settings';

const serverless = combineReducers({
  page_type_config: pageTypeList,
  fragments,
  notification,
  settings
});

export default serverless;