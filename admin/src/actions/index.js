import { API, graphqlOperation } from 'aws-amplify';
import * as R from 'ramda';

import {
  putFragmentMutation,
  removeFragmentMutation
} from '../graphql/fragment-queries';

import {
  get_fragment_list,
  put_fragment,
  remove_fragment
} from './types';


export const getFragmentList = ({ query, type }) => dispatch => {
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

export const putFragment = (input, type) => dispatch => {
  const mutation = putFragmentMutation(type);

  API.graphql(graphqlOperation(mutation, { input }))
    .then(result => {
      dispatch({
        type: put_fragment,
        payload: R.mergeAll([input, { type }, result.data[`put${type}`]])
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