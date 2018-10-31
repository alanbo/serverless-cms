import {
  get_menu_list
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

    default:
      return state
  }
}

export default menuList;