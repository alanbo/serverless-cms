import * as R from 'ramda';

import {
  get_menu_list,
  put_menu
} from '../actions/types';


function menuList(state = {}, action) {

  switch (action.type) {
    case get_menu_list: {
      const menus = {};

      action.payload.forEach(menu => {
        menus[menu.id] = menu;
      });

      return menus;
    }

    case put_menu:
      return R.assoc(action.payload.id, action.payload, state);

    default:
      return state
  }
}

export default menuList;