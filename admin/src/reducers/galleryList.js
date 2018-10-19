import {
  add_gallery_list,
  add_gallery,
  remove_gallery,
  add_images_to_gallery,
  remove_image_from_gallery
} from '../actions/types';


function galleryList(state = {}, action) {
  switch (action.type) {
    case add_gallery_list: {
      const galleries = {};

      action.payload.forEach(gal => {
        galleries[gal.name] = gal;
      });

      return Object.assign({}, state, galleries);
    }

    case add_gallery: {
      return Object.assign({}, state, { [action.payload.name]: action.payload });
    }
      
    case remove_gallery: {
      const new_state = Object.assign({}, state);
      delete new_state[action.payload.name];

      return new_state;
    }

    case add_images_to_gallery: {
      let galleries_copy = Object.assign({}, state);

      galleries_copy[action.payload.name].images = action.payload.images;

      return galleries_copy;
    }

    case remove_image_from_gallery: {
      const new_state = Object.assign({}, state);
      const { images, name } = action.payload;

      new_state[name].images = images;

      return new_state;
    }
      
    default:
      return state
  }
}

export default galleryList;