import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  renderPages as render_pages_mutation
} from '../../graphql/page-queries';

function renderPages() {
  API.graphql(graphqlOperation(render_pages_mutation))
    .then(result => {
      console.log('Pages rendered: ', result)
    })
    .catch(console.log);
}

const Home = () => {
  return <div>
    <h1>Home</h1>
    <button onClick={renderPages}>Render pages</button>
  </div>;
};

export { Home };
