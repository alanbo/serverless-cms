import { combineReducers } from 'redux';
import pageTypeList from './pageTypeList';
import fragments from './fragments';
import notification from './notification';

const serverless = combineReducers({
  page_type_config: pageTypeList,
  fragments,
  notification
});

export default serverless;