import {
  SYSTEM_ROLE_LIST,
  SYSTEM_ROLE_STATUS,
  SYSTEM_ROLE_SCANALL,
} from '../action-type.js';


export function getSystemRoleList(n) {
  return { type: SYSTEM_ROLE_LIST, payload: n };
}

export function getSystemRoleStatus(n) {
  return { type: SYSTEM_ROLE_STATUS, payload: n };
}

export function getSystemRoleScanall(n) {
  return { type: SYSTEM_ROLE_SCANALL, payload: n };
}
