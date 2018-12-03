
import * as R from 'ramda';

import {
  get_fragment_list,
  put_fragment
} from '../actions/types';


function fragmentList(state = {}, action) {
  switch (action.type) {
    case get_fragment_list: {
      const new_state = {};

      action.payload.forEach(obj => {
        new_state[obj.id] = obj;
      });

      return Object.assign({}, state, new_state);
    }

    case put_fragment:
      return R.assoc(action.payload.id, action.payload, state);

    default:
      return state
  }
}

export default fragmentList;