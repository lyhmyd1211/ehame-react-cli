import {
  POWERS,
} from './action-type.js';


export function getPowers(n) {
  return { type: POWERS, payload: n };
}
