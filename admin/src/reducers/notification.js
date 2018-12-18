import * as R from 'ramda';

import {
  delete_occurs_in_error,
  clear_notification
} from '../actions/types';

function notification(state = {}, action) {
  switch (action.type) {
    case delete_occurs_in_error: {
      let msg = 'Can\'t delete element as it occurs in: ';

      action.payload.forEach(fg => {
        msg += `${fg.type}: ${fg.name}, `
      });

      return {
        type: 'error',
        msg
      }
    }

    case clear_notification:
      return null

    default:
      return state;
  }
}

export default notification;