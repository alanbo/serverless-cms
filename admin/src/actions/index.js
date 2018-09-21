import { API, graphqlOperation } from 'aws-amplify';

import {
    getImageList as images_query,
    getGalleryList as gallery_query
} from '../graphql/image-queries';

import {
  add_image_list,
  add_gallery_list
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


