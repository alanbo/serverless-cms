import * as R from 'ramda';

import {
  delete_occurs_in_error,
  clear_notification,
  save_failure,
  save_success
} from '../actions/types';

function notification(state = {}, action) {
  switch (action.type) {
    case delete_occurs_in_error: {
      let msg = 'Can\'t delete element as it occurs in:';

      action.payload.forEach(fg => {
        msg += `\n${fg.type}: ${fg.name}, `
      });

      return {
        type: 'error',
        msg
      }
    }

    case clear_notification:
      return {};

    case save_failure:
      return {
        type: 'error',
        msg: `Something went wrong. Couldn't save ${action.payload.type}: "${action.payload.name}".`
      };

    case save_success:
      return {
        type: 'success',
        msg: `Successfully saved ${action.payload.type}: "${action.payload.name}".`
      };

    default:
      return state;
  }
}

export default notification;