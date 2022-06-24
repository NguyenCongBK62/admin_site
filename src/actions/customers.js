import {
  FETCH_CUSTOMER_BY_CHARACTER,
  SET_CUSTOMER_LIST,
  FETCH_CUSTOMER_LIST,
  FETCH_CUSTOMER_STATUS,
  SET_CUSTOMER_STATUS,
  SET_CUSTOMER_DETAILS,
  FETCH_CUSTOMER_DETAILS,
  SUBMIT_CUSTOMER_FORM,
  UPDATE_CUSTOMER_FORM,
  SET_CUSTOMER_FORM,
  SET_CUSTOMER_HISTORY,
  FETCH_CUSTOMER_HISTORY,
  DELETE_CUSTOMER,
  GET_CUSTOMER_ADVANCE_SEARCH,
} from "constant";

export function setCustomerList(payload) {
  return {
    type: SET_CUSTOMER_LIST,
    payload,
  };
}

export function fetchCustomerList(payload) {
  return {
    type: FETCH_CUSTOMER_LIST,
    payload,
  };
}

export function fetchCustomerListByCharacter(payload) {
  return {
    type: FETCH_CUSTOMER_BY_CHARACTER,
    payload,
  };
}

export function fetchCustomerListAdvanceSearch(payload) {
  return {
    type: GET_CUSTOMER_ADVANCE_SEARCH,
    payload,
  };
}

export function fetchCustomerStatus() {
  return {
    type: FETCH_CUSTOMER_STATUS,
  };
}

export function setCustomerStatus(payload) {
  return {
    type: SET_CUSTOMER_STATUS,
    payload,
  };
}

export function submitCustomerForm(payload) {
  return {
    type: SUBMIT_CUSTOMER_FORM,
    payload,
  };
}

export function setCustomerForm(payload) {
  return {
    type: SET_CUSTOMER_FORM,
    payload,
  };
}

export function updateCustomerForm(payload) {
  return {
    type: UPDATE_CUSTOMER_FORM,
    payload,
  };
}

export function fetchCustomerDetails(payload) {
  return {
    type: FETCH_CUSTOMER_DETAILS,
    payload,
  };
}

export function setCustomerDetails(payload) {
  return {
    type: SET_CUSTOMER_DETAILS,
    payload,
  };
}

export function fetchCustomerHistory(payload) {
  return {
    type: FETCH_CUSTOMER_HISTORY,
    payload,
  };
}

export function setCustomerHistory(payload) {
  return {
    type: SET_CUSTOMER_HISTORY,
    payload,
  };
}

export function deleteCustomer(payload) {
  return {
    type: DELETE_CUSTOMER,
    payload,
  };
}
