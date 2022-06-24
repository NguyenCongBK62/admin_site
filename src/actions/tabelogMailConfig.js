import {
  CONFIG_TABELOG_MAIL,
  CREATE_TABELOG_SUCCESS,
  RESET_CREATE_TABELOG_SUCCESS,
} from "constant";

export function setTabelogMailConfig(payload) {
  return {
    type: CONFIG_TABELOG_MAIL,
    payload,
  };
}

export function createTabelogSuccess(payload) {
  return {
    type: CREATE_TABELOG_SUCCESS,
    payload,
  };
}

export function resetCreateTabelogSuccess(payload) {
  return {
    type: RESET_CREATE_TABELOG_SUCCESS,
    payload,
  };
}
