import {
  FETCH_CUSTOMER_BY_PHONE,
  SET_CUSTOMER_SUGGESTION,
  FETCH_TABLE_LIST,
  SET_TABLE_LIST,
  FETCH_MENU_LIST,
  SET_MENU_LIST,
  FETCH_RECEPTIONIST,
  SET_RECEPTIONIST,
  FETCH_RESERVATION_METHOD,
  SET_RESERVATION_METHOD,
  CREATE_RESERVATION,
  SET_RESERVATION,
  UPDATE_RESERVATION,
  SEND_SMS_RESERVATION_MESSAGE,
  CONFIRM_NET_RESERVATION,
  CREATE_RPA_RESERVATION,
} from "constant";

export function fetchCustomer(payload) {
  return {
    type: FETCH_CUSTOMER_BY_PHONE,
    payload,
  };
}

export function setCustomerSuggestion(payload) {
  return { type: SET_CUSTOMER_SUGGESTION, payload };
}

export function fetchTable(payload) {
  return {
    type: FETCH_TABLE_LIST,
    payload,
  };
}

export function setTable(payload) {
  return {
    type: SET_TABLE_LIST,
    payload,
  };
}

export function fetchMenu(payload) {
  return {
    type: FETCH_MENU_LIST,
    payload,
  };
}

export function setMenu(payload) {
  return {
    type: SET_MENU_LIST,
    payload,
  };
}

export function fetchReceptionists(payload) {
  return {
    type: FETCH_RECEPTIONIST,
    payload,
  };
}

export function setReceptionists(payload) {
  return {
    type: SET_RECEPTIONIST,
    payload,
  };
}

export function fetchReservationMethod(payload) {
  return {
    type: FETCH_RESERVATION_METHOD,
    payload,
  };
}

export function setReservationMethod(payload) {
  return {
    type: SET_RESERVATION_METHOD,
    payload,
  };
}

export function createReservation(payload) {
  return {
    type: CREATE_RESERVATION,
    payload,
  };
}

export function updateReservation(payload) {
  return {
    type: UPDATE_RESERVATION,
    payload,
  };
}

export function setReservation(payload) {
  return {
    type: SET_RESERVATION,
    payload,
  };
}

export function sendSMSReservationMessage(payload) {
  return {
    type: SEND_SMS_RESERVATION_MESSAGE,
    payload,
  };
}

export function confirmNetReservation(payload) {
  return {
    type: CONFIRM_NET_RESERVATION,
    payload,
  };
}

export function createRpaReservation(payload) {
  return {
    type: CREATE_RPA_RESERVATION,
    payload,
  };
}
