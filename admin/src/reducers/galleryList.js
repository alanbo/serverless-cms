import {
  add_gallery_list
} from '../actions/types';


function galleryList(state = {}, action) {
  switch (action.type) {
    case add_gallery_list:
      const galleries = {};

      action.payload.forEach(gal => {
        galleries[gal.name] = gal;
      });

      return Object.assign({}, state, galleries);
    default:
      return state
  }
}

export default galleryList;