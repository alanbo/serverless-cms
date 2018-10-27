import { API, graphqlOperation } from 'aws-amplify';

import {
  getImageList as images_query,
  getGalleryList as gallery_query,
  addGallery as add_gallery_mutation,
  removeGallery as remove_gallery_mutation,
  removeImage as remove_image_mutation,
  addImagesToGallery as add_images_to_gallery_mutation,
  removeImageFromGallery as remove_image_from_gallery_mutation,
  reorderImagesInGallery as reorder_images_in_gallery_mutation,
} from '../graphql/image-queries';

import {
  putText as put_text_mutation,
  getTextList as get_text_list_query,
  removeText as remove_text_mutation,
  updateText as update_text_mutation
} from '../graphql/fragment-queries';

import {
  add_image_list,
  add_gallery_list,
  add_gallery,
  remove_gallery,
  remove_image,
  add_images_to_gallery,
  remove_image_from_gallery,
  reorder_images_in_gallery,
  put_text,
  get_text_list,
  remove_text,
  update_text
} from '../actions/types';

export const fetchImageList = () => {
  return dispatch => {
    API.graphql(graphqlOperation(images_query))
      .then(result => {
        dispatch({
          type: add_image_list,
          payload: result.data.getImageList
        });
      })
      .catch(console.log);
  }
}

export const fetchGalleryList = () => {
  return dispatch => {
    API.graphql(graphqlOperation(gallery_query))
      .then(result => {
        dispatch({
          type: add_gallery_list,
          payload: result.data.getGalleryList
        });
      })
      .catch(console.log);
  }
}

export const addGallery = name => {
  return dispatch => {
    API.graphql(graphqlOperation(add_gallery_mutation, { name }))
      .then(result => {
        dispatch({
          type: add_gallery,
          payload: result.data.addGallery
        });
      })
      .catch(console.log);
  }
}


export const removeGallery = id => {
  return dispatch => {
    API.graphql(graphqlOperation(remove_gallery_mutation, { id }))
      .then(result => {
        dispatch({
          type: remove_gallery,
          payload: result.data.removeGallery
        });
      })
      .catch(console.log);
  }
}

export const removeImage = id => {
  return dispatch => {
    API.graphql(graphqlOperation(remove_image_mutation, { id }))
      .then(result => {
        dispatch({
          type: remove_image,
          payload: id
        });
      })
      .catch(console.log);
  }
}


export const addImagesToGallery = (id, image_ids) => {
  return dispatch => {
    API.graphql(graphqlOperation(add_images_to_gallery_mutation, { id, image_ids }))
      .then(result => {
        dispatch({
          type: add_images_to_gallery,
          payload: result.data.addImagesToGallery
        });
      })
      .catch(console.log);
  }
}


export const removeImageFromGallery = (id, image_number) => {
  return dispatch => {
    API.graphql(graphqlOperation(remove_image_from_gallery_mutation, { id, image_number }))
      .then(result => {
        dispatch({
          type: remove_image_from_gallery,
          payload: result.data.removeImageFromGallery
        });
      })
      .catch(console.log);
  }
}


export const reorderImagesInGallery = (id, image_ids) => {
  return dispatch => {
    API.graphql(graphqlOperation(reorder_images_in_gallery_mutation, { id, image_ids }))
      .then(result => {
        dispatch({
          type: reorder_images_in_gallery,
          payload: result.data.reorderImagesInGallery
        });
      })
      .catch(console.log);
  }
}


export const putText = (text, is_rich = false) => {
  return dispatch => {
    API.graphql(graphqlOperation(put_text_mutation, { text, is_rich }))
      .then(result => {
        dispatch({
          type: put_text,
          payload: result.data.putText
        });
      })
      .catch(console.log);
  }
}

export const getTextList = () => {
  return dispatch => {
    API.graphql(graphqlOperation(get_text_list_query))
      .then(result => {
        dispatch({
          type: get_text_list,
          payload: result.data.getTextList
        });
      })
      .catch(console.log);
  }
}


export const removeText = id => {
  return dispatch => {
    API.graphql(graphqlOperation(remove_text_mutation, { id }))
      .then(result => {
        dispatch({
          type: remove_text,
          payload: id
        });
      })
      .catch(console.log);
  }
}

export const updateText = (text, id) => {
  return dispatch => {
    API.graphql(graphqlOperation(update_text_mutation, { id, text }))
      .then(result => {
        dispatch({
          type: update_text,
          payload: result.data.updateText
        });
      })
      .catch(console.log);
  }
}