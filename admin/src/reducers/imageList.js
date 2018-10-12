import {
  add_image_list
} from '../actions/types';


function imageList(state = {}, action) {
  switch (action.type) {
    case add_image_list:
      const images = {};

      action.payload.forEach(img => {
        images[img.id] = img;
      });

      return Object.assign({}, state, images);
    default:
      return state
  }
}

export default imageList;