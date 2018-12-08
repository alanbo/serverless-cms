
import * as R from 'ramda';

import {
  get_fragment_list,
  put_fragment,
  remove_fragment,
  resize_images
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

    case remove_fragment:
      return R.assocPath([action.payload, 'is_deleted'], true, state);

    case resize_images:
      return R.pipe(
        R.map(obj => ({ [obj.id]: obj })),
        R.mergeAll,
        R.merge(state)
      )(action.payload);

    default:
      return state
  }
}

export default fragmentList;