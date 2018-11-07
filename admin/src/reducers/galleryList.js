import {
  add_gallery_list,
  add_gallery,
  remove_gallery,
  add_images_to_gallery,
  remove_image_from_gallery,
  reorder_images_in_gallery
} from '../actions/types';


function galleryList(state = {}, action) {
  switch (action.type) {
    case add_gallery_list: {
      const galleries = {};

      action.payload.forEach(gal => {
        console.log(gal);
        const images = gal.images.map(obj => obj.id);

        const gallery = { ...gal, images };

        galleries[gal.name] = gallery;
      });

      return Object.assign({}, state, galleries);
    }

    case add_gallery: {
      return Object.assign({}, state, { [action.payload.name]: { ...action.payload, images: [] } });
    }

    case remove_gallery: {
      const new_state = Object.assign({}, state);
      delete new_state[action.payload.name];

      return new_state;
    }

    case reorder_images_in_gallery:
    case add_images_to_gallery: {
      let galleries_copy = Object.assign({}, state);

      galleries_copy[action.payload.name].images = action.payload.images.map(obj => obj.id);

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