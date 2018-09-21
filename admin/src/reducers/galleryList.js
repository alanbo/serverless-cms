import {
  add_gallery_list,
  add_gallery,
  remove_gallery
} from '../actions/types';


function galleryList(state = {}, action) {
  switch (action.type) {
    case add_gallery_list:
      const galleries = {};

      action.payload.forEach(gal => {
        galleries[gal.name] = gal;
      });

      return Object.assign({}, state, galleries);

    case add_gallery:
      return Object.assign({}, state, { [action.payload.name]: action.payload });
      
    case remove_gallery:
      const new_state = Object.assign({}, state);
      delete new_state[action.payload.name];

      return new_state;
    default:
      return state
  }
}

export default galleryList;