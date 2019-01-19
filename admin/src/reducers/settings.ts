import * as R from 'ramda';

import {
  get_head_settings,
  put_head_settings,
} from '../actions/types';


function pageTypeList(state = {}, action) {

  switch (action.type) {
    case get_head_settings:
    case put_head_settings:
      return action.payload
    default:
      return state
  }
}

export default pageTypeList;