import {
  LOGIN,
  SET_LOGIN,
  FETCH_ACCOUNT_PROFILE,
  SET_ACCOUNT_PROFILE,
} from "constant";

export function login(username, password) {
  return {
    type: LOGIN,
    username,
    password,
  };
}

export function setLogin(token, isLoading, errorMsg) {
  return {
    type: SET_LOGIN,
    payload: {
      token,
      isLoading,
      errorMsg,
    },
  };
}

export function getAccountProfile() {
  return {
    type: FETCH_ACCOUNT_PROFILE,
  };
}

export function setAccountProfile(payload) {
  return {
    type: SET_ACCOUNT_PROFILE,
    payload,
  };
}
