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

import {
  getFragmentListQuery
} from '../graphql/fragment-queries';

import config from '../fg-config';

let type_to_gql_props = {};

Object.keys(config).forEach(key => {
  const type = config[key].type;

  type_to_gql_props[type] = config[key].gql_props
});

console.log(type_to_gql_props);


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

export const putFragment = (input, type) => dispatch => {
  const mutation = putFragmentMutation(type, type_to_gql_props[type]);
  console.log(mutation);

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