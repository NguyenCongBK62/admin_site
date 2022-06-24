import {
  CONFIG_GNAVI_MAIL,
  CREATE_GNAVI_SUCCESS,
  RESET_CREATE_GNAVI_SUCCESS,
} from "constant";

export function setGnaviMailConfig(payload) {
  return {
    type: CONFIG_GNAVI_MAIL,
    payload,
  };
}

export function createGnaviSuccess(payload) {
  return {
    type: CREATE_GNAVI_SUCCESS,
    payload,
  };
}

export function resetCreateGnaviSuccess(payload) {
  return {
    type: RESET_CREATE_GNAVI_SUCCESS,
    payload,
  };
}
