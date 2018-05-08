import { combineReducers } from 'redux';
import {
  SYSTEM_DICTIONARY_LIST,
} from '../../action/action-type.js';

const list = (state = { }, action = {})=>{
  switch (action.type) {
    case SYSTEM_DICTIONARY_LIST:
      return action.payload;
    default:
      return state;
  }
};


export default combineReducers({
  list,
});

