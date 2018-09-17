import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import root_reducer from './reducers/index';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const middleware = [
  thunk
];

const store = createStore(root_reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));

ReactDOM.render((
  <BrowserRouter>
    <Provider store={ store }>
      <App />
    </Provider>
  </BrowserRouter>
), document.getElementById('root'))

registerServiceWorker();
