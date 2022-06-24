import {
  SET_HOST_MAIL_CONFIG_TYPE,
  FETCH_ALL_MAIL_CONFIG,
  SET_ALL_MAIL_STATUS,
  DELETE_MAIL_CONFIG,
} from "constant";

export function setHostMailConfigType(payload) {
  return {
    type: SET_HOST_MAIL_CONFIG_TYPE,
    payload,
  };
}

export function fetchAllMailConfig(companyCode, storeId) {
  return {
    type: FETCH_ALL_MAIL_CONFIG,
    companyCode,
    storeId,
  };
}

export function setAllMailStatus(payload) {
  return {
    type: SET_ALL_MAIL_STATUS,
    payload,
  };
}

export function deleteMailConfig(payload) {
  return {
    type: DELETE_MAIL_CONFIG,
    payload,
  };
}
