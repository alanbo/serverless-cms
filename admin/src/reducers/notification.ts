import * as R from 'ramda';

import {
  delete_occurs_in_error,
  clear_notification,
  save_failure,
  save_success,
  permanent_delete_failure,
  permanent_delete_success,
  render_success,
  render_error,
  put_head_settings_error,
  put_head_settings_success
} from '../actions/types';

function notification(state = {}, action) {
  switch (action.type) {
    case delete_occurs_in_error: {
      let msg = 'Can\'t delete element as it occurs in:';

      action.payload.forEach(fg => {
        msg += `${fg.type}: ${fg.name}, `
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
        msg: `Successfully saved ${action.payload.type}: "${action.payload.name}".`,
        timeout: 2000
      };

    case permanent_delete_success:
      return {
        type: 'success',
        msg: 'Successfully performed removing items from th trash',
        timeout: 2000
      };

    case permanent_delete_failure:
      return {
        type: 'success',
        msg: 'Failed to empty items from the trash'
      };

    case render_error:
      return {
        type: 'error',
        msg: 'Failed to render pages'
      }

    case render_success:
      return {
        type: 'success',
        msg: 'Successfully rendered the pages',
        timeout: 2000
      }

    case put_head_settings_error:
      return {
        type: 'error',
        msg: 'Failed to save the settings',
      }

    case put_head_settings_success:
      return {
        type: 'success',
        msg: 'Successfully saved the settings',
        timeout: 2000
      }

    default:
      return state;
  }
}

export default notification;