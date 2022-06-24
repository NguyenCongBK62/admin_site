import {
  CONFIG_HOTPEPPER_MAIL,
  CREATE_HOTPEPPER_SUCCESS,
  RESET_CREATE_HOTPEPPER_SUCCESS,
} from "constant";

export function setHotpepperMailConfig(payload) {
  return {
    type: CONFIG_HOTPEPPER_MAIL,
    payload,
  };
}

export function createHotpepperSuccess(payload) {
  return {
    type: CREATE_HOTPEPPER_SUCCESS,
    payload,
  };
}

export function resetCreateHotpepperSuccess(payload) {
  return {
    type: RESET_CREATE_HOTPEPPER_SUCCESS,
    payload,
  };
}
