//reducer
import {
  LANGUAGE, POWERS,SIDEBAR_SHOW,
} from '../action/action-type.js';

import { combineReducers } from 'redux';
import system from './system';


const defaultPowers = window.sessionStorage.powers !== undefined ? JSON.parse(window.sessionStorage.powers) : {};
const powers = (state = defaultPowers, action = {}) => {
  switch (action.type) {
    case POWERS:
      if (action.payload !== undefined) {
        window.sessionStorage.powers = JSON.stringify(action.payload);
      }
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  system,  powers,
});

