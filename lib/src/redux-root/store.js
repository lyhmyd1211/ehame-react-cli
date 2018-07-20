//store
import {
  createStore,
  // applyMiddleware
} from 'redux';

// import { createLogger } from 'redux-logger';

import reducer from './reducer';

// Store
export default createStore(reducer,
  // applyMiddleware(createLogger())
);



