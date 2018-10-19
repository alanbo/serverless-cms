import { API, graphqlOperation } from 'aws-amplify';

import {
    getImageList as images_query,
    getGalleryList as gallery_query,
    addGallery as add_gallery_mutation,
    removeGallery as remove_gallery_mutation,
    removeImage as remove_image_mutation,
    addImagesToGallery as add_images_to_gallery_mutation,
    removeImageFromGallery as remove_image_from_gallery_mutation
} from '../graphql/image-queries';

import {
  add_image_list,
  add_gallery_list,
  add_gallery,
  remove_gallery,
  remove_image,
  add_images_to_gallery,
  remove_image_from_gallery
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
        API.graphql(graphqlOperation(remove_image_from_gallery_mutation, { id, image_number}))
            .then(result => {
                dispatch({
                    type: remove_image_from_gallery,
                    payload: result.data.removeImageFromGallery
                });
            })
            .catch(console.log);
    }
}


