import {
  FETCH_ALL_ACCOUNT_LIST,
  SET_ALL_ACCOUNT_LIST,
  RE_ORDERED_ACCOUNTS,
  DELETE_ACCOUNT,
  CREATE_ACCOUNT_USER,
  SET_IS_CREATED_ACCOUNT,
  FETCH_ACCOUNT_DETAILS_BY_USER_ID,
  SET_LOADED_ACCOUNT_DETAILS,
  UPDATE_ACCOUNT_USER,
} from "constant";

export function fetchAllAccountList() {
  return {
    type: FETCH_ALL_ACCOUNT_LIST,
  };
}

export function setAllAccountList(data, isLoading) {
  return {
    type: SET_ALL_ACCOUNT_LIST,
    payload: {
      data,
      isLoading,
    },
  };
}

export function reOrderAccounts(reOrderedData) {
  return {
    type: RE_ORDERED_ACCOUNTS,
    reOrderedData,
  };
}

export function deleteAccount(id) {
  return {
    type: DELETE_ACCOUNT,
    id,
  };
}

export function createAccountUser(data) {
  return {
    type: CREATE_ACCOUNT_USER,
    data,
  };
}

export function updateAccountUser(data) {
  return {
    type: UPDATE_ACCOUNT_USER,
    data,
  };
}

export function setIsCreatedAccount(payload) {
  return {
    type: SET_IS_CREATED_ACCOUNT,
    payload,
  };
}

export function fetchAccountDetailsByUserId(id) {
  return {
    type: FETCH_ACCOUNT_DETAILS_BY_USER_ID,
    id,
  };
}

export function setLoadedAccountDetails(payload) {
  return {
    type: SET_LOADED_ACCOUNT_DETAILS,
    payload,
  };
}
