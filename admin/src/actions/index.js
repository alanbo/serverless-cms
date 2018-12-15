import { API, graphqlOperation } from 'aws-amplify';
import * as R from 'ramda';

import {
  putFragmentMutation,
  removeFragmentMutation,
  resize_images_mutation,
  restore_fragment_mutation
} from '../graphql/fragment-queries';

import {
  getPageTypeList as get_page_type_list_query
} from '../graphql/page-queries';

import {
  get_fragment_list,
  put_fragment,
  remove_fragment,
  resize_images,
  get_page_type_list,
  restore_fragment
} from './types';

import {
  getFragmentListQuery
} from '../graphql/fragment-queries';

import config from '../fg-config';

let type_to_gql_props = {};

Object.keys(config).forEach(key => {
  const type = config[key].type;

  type_to_gql_props[type] = config[key].gql_props
});


export const getFragmentList = type => dispatch => {
  const query = getFragmentListQuery(type, type_to_gql_props[type]);

  API.graphql(graphqlOperation(query))
    .then(result => {
      const { data } = result;
      // there is only one property, get it
      const key = Object.keys(data)[0];

      dispatch({
        type: get_fragment_list,
        payload: data[key].map(item => Object.assign(item, { type }))
      });
    })
    .catch(console.log);
}



export const getPageTypeList = () => dispatch => {
  API.graphql(graphqlOperation(get_page_type_list_query))
    .then(result => {
      const { data } = result;
      // there is only one property, get it
      const key = Object.keys(data)[0];

      dispatch({
        type: get_page_type_list,
        payload: data[key]
      });
    })
    .catch(console.log);
}

export const putFragment = (input, type) => dispatch => {
  const mutation = putFragmentMutation(type, type_to_gql_props[type]);

  API.graphql(graphqlOperation(mutation, { input }))
    .then(result => {
      const payload = Object.assign({}, result.data[`put${type}`], {
        type
      });

      dispatch({
        type: put_fragment,
        payload
      });
    })
    .catch(console.log);
}

export const removeFragment = id => {
  return dispatch => {
    API.graphql(graphqlOperation(removeFragmentMutation, { id }))
      .then(result => {
        dispatch({
          type: remove_fragment,
          payload: result.data.deleteFragment
        });
      })
      .catch(console.log);
  }
}

export const restoreFragment = id => {
  return dispatch => {
    API.graphql(graphqlOperation(restore_fragment_mutation, { id }))
      .then(result => {
        dispatch({
          type: restore_fragment,
          payload: result.data.recoverFragment
        });
      })
      .catch(console.log);
  }
}

export const resizeImages = (paths, callback) => dispatch => {
  API.graphql(graphqlOperation(resize_images_mutation, { paths }))
    .then(result => {
      if (typeof callback === 'function') {
        callback(result.data.resizeImages);
      }

      dispatch({
        type: resize_images,
        payload: result.data.resizeImages
      });
    })
    .catch(console.log);
}