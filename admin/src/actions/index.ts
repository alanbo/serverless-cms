import { API, graphqlOperation } from 'aws-amplify';
import * as R from 'ramda';

import {
  putFragmentMutation,
  removeFragmentMutation,
  resize_images_mutation,
  restore_fragment_mutation,
  permanently_delete_fragments_mutation,
  put_head_settings_mutation,
  get_head_settings_query
} from '../graphql/fragment-queries';

import {
  getPageTypeList as get_page_type_list_query,
  renderPages as render_pages_mutation
} from '../graphql/page-queries';

import {
  get_fragment_list,
  put_fragment,
  remove_fragment,
  resize_images,
  get_page_type_list,
  restore_fragment,
  delete_occurs_in_error,
  clear_notification,
  save_failure,
  save_success,
  permanently_delete_fragments,
  permanent_delete_success,
  permanent_delete_failure,
  render_error,
  render_success,
  put_head_settings,
  get_head_settings,
  put_head_settings_error,
  put_head_settings_success
} from './types';

import {
  getFragmentListQuery
} from '../graphql/fragment-queries';

import config from '../components/inputs/input-config';

let type_to_gql_props = {};

Object.keys(config).forEach(key => {
  const type = config[key].type;

  type_to_gql_props[type] = config[key].gql_props
});

export const saveWasSuccessful = (type, name) => ({
  type: save_success,
  payload: { type, name }
});

export const saveHasFailed = (type, name) => ({
  type: save_failure,
  payload: { type, name }
});


export const getFragmentList = type => dispatch => {
  const gfl_query = getFragmentListQuery(type, type_to_gql_props[type]);

  const query = API.graphql(graphqlOperation(gfl_query)) as Promise<any>;
  query.then(result => {
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
  const query = API.graphql(graphqlOperation(get_page_type_list_query)) as Promise<any>;

  query.then(result => {
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
  const put_fragment_mutation = putFragmentMutation(type, type_to_gql_props[type]);

  const mutation = API.graphql(graphqlOperation(put_fragment_mutation, { input })) as Promise<any>;

  mutation.then(result => {
    const payload = Object.assign({}, result.data[`put${type}`], {
      type
    });

    dispatch({
      type: put_fragment,
      payload
    });

    dispatch(saveWasSuccessful(type, input.name));
  })
    .catch(err => {
      dispatch(saveHasFailed(type, input.name));
      console.log(err);
    });
}

function checkIfIDReferedTo(id, fields) {
  if (id === fields) {
    return true;
  }

  else if (R.type(fields) === 'Object') {
    return Object.keys(fields)
      .filter(key => key !== 'id')
      .map(key => fields[key])
      .map(field => checkIfIDReferedTo(id, field))
      .filter(field => field)[0];
  } else if (R.type(fields) === 'Array') {
    return fields
      .map(field => checkIfIDReferedTo(id, field))
      .filter(field => field)[0];
  }

  return false;
}

export const removeFragment = id => (dispatch, getState) => {
  const { fragments } = getState();

  // temporary solution to prevent deletion of fragments, 
  // that are refered to
  // when aws supports transactions
  // for dynamodb appsync resolvers
  // use that
  const occurs_in = R.values(fragments)
    .map(fg => {
      const is_refered = checkIfIDReferedTo(id, fg);

      return is_refered ? fg : null
    })
    .filter(item => !!item);

  if (occurs_in.length) {
    dispatch({
      type: delete_occurs_in_error,
      payload: occurs_in
    });
  }


  const mutation = API.graphql(graphqlOperation(removeFragmentMutation, { id })) as Promise<any>;

  mutation.then(result => {
    dispatch({
      type: remove_fragment,
      payload: result.data.deleteFragment
    });
  })
    .catch(console.log);
}

export const restoreFragment = id => {
  return dispatch => {
    const mutation = API.graphql(graphqlOperation(restore_fragment_mutation, { id })) as Promise<any>;

    mutation.then(result => {
      dispatch({
        type: restore_fragment,
        payload: result.data.recoverFragment
      });
    })
      .catch(console.log);
  }
}

export const resizeImages = (paths, callback) => dispatch => {
  const mutation = API.graphql(graphqlOperation(resize_images_mutation, { paths })) as Promise<any>;

  mutation.then(result => {
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

export const clearNotification = () => ({
  type: clear_notification
});

export const permanentlyDeleteFragments = ids => {
  return dispatch => {
    const mutation = API.graphql(graphqlOperation(permanently_delete_fragments_mutation, { ids })) as Promise<any>;

    mutation.then(result => {
      dispatch({
        type: permanently_delete_fragments,
        payload: result.data.permanentlyDeleteFragments
      });

      dispatch({
        type: permanent_delete_success
      })
    })
      .catch(err => {
        console.log(err);
        dispatch({ type: permanent_delete_failure });
      });
  }
}

export const renderPages = () => dispatch => {
  const mutation = API.graphql(graphqlOperation(render_pages_mutation)) as Promise<any>;

  mutation.then(result => {
    dispatch({
      type: render_success
    })
  })
    .catch(err => {
      console.log(err);

      dispatch({
        type: render_error
      })
    });
}

export const putHeadSettings = (settings) => dispatch => {
  const input = Object.assign({}, settings, {
    name: 'head settings',
    id: 'head_settings'
  });

  const mutation = API.graphql(graphqlOperation(put_head_settings_mutation, { input })) as Promise<any>;

  mutation.then(result => {
    dispatch({
      type: put_head_settings_success
    })

    dispatch({
      type: put_head_settings,
      payload: result.data.putHeadSettings
    })
  })
    .catch(err => {
      console.log(err);

      dispatch({
        type: put_head_settings_error
      })
    });
}


export const getHeadSettings = () => dispatch => {
  const query = API.graphql(graphqlOperation(get_head_settings_query)) as Promise<any>;

  query.then(result => {

    dispatch({
      type: get_head_settings,
      payload: result.data.getHeadSettings
    });
  })
    .catch(console.log);
}



