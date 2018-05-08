import {
  SYSTEM_DICTIONARY_LIST,
} from '../action-type.js';


export function getSystemDictionaryList(n) {
  return { type: SYSTEM_DICTIONARY_LIST, payload: n };
}
