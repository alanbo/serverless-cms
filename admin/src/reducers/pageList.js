import * as R from 'ramda';

import {
  get_page_list,
  remove_page,
  put_page
} from '../actions/types';


function pageList(state = {}, action) {

  switch (action.type) {
    case get_page_list: {
      const new_state = {};

      action.payload.forEach(obj => {
        new_state[obj.id] = obj;
      });

      return new_state;
    }

    case put_page:
      return R.assoc(action.payload.id, action.payload, state);

    case remove_page:
      return R.dissoc(action.payload.id, state);

    default:
      return state
  }
}

export default pageList;