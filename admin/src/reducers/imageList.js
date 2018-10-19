import {
  add_image_list,
  remove_image
} from '../actions/types';


function imageList(state = {}, action) {
  let images = {};

  switch (action.type) {
    case add_image_list:
      action.payload.forEach(img => {
        images[img.id] = img;
      });

      return images;
    case remove_image:
      images = Object.assign({}, state, images);

      delete images[action.payload];

      return images;


    default:
      return state
  }
}

export default imageList;