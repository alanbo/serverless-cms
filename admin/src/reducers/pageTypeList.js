import * as R from 'ramda';

import {
  get_page_type_list,
} from '../actions/types';


function pageTypeList(state = {}, action) {

  switch (action.type) {
    case get_page_type_list: {
      const new_state = {};

      action.payload.forEach(obj => {
        new_state[obj.name] = obj;
      });

      return new_state;
    }

    default:
      return state
  }
}

export default pageTypeList;