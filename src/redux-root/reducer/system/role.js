import { combineReducers } from 'redux';
import {
  SYSTEM_ROLE_LIST,
  SYSTEM_ROLE_STATUS,
  SYSTEM_ROLE_SCANALL,
} from '../../action/action-type.js';

const list = (state = { }, action = {})=>{
  switch (action.type) {
    case SYSTEM_ROLE_LIST:
      return action.payload;
    default:
      return state;
  }
};

const status = (state =[], action = {})=>{
   switch (action.type) {
    case SYSTEM_ROLE_STATUS:
      return action.payload;
    default:
      return state;
  }
};

const scanall = (state =[], action = {})=>{
   switch (action.type) {
    case SYSTEM_ROLE_SCANALL:
      return action.payload;
    default:
      return state;
  }
};
export default combineReducers({
  list,status,scanall,
});
