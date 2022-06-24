import {
  CREATE_NET_RESERVATION,
  SET_NET_CREATED,
  FETCH_STORE_DETAILS_BY_UUID,
  SET_STORE_DETAILS,
  FETCH_HOLIDAYS,
  SET_HOLIDAYS,
  FETCH_TABLE_AVAILABLE_TIME,
  SET_TABLE_AVAILABLE_TIME,
} from "constant";

export function createNetReservation(payload) {
  return {
    type: CREATE_NET_RESERVATION,
    payload,
  };
}

export function setNetCreated(payload) {
  return {
    type: SET_NET_CREATED,
    payload,
  };
}

export function fetchStoreDetailsByUUID(payload) {
  return {
    type: FETCH_STORE_DETAILS_BY_UUID,
    payload,
  };
}

export function setStoreDetails(payload) {
  return {
    type: SET_STORE_DETAILS,
    payload,
  };
}

export function fetchHolidays(payload) {
  return {
    type: FETCH_HOLIDAYS,
    payload,
  };
}

export function setHolidays(payload) {
  return {
    type: SET_HOLIDAYS,
    payload,
  };
}

export function fetchTableAvailableTime(payload) {
  return {
    type: FETCH_TABLE_AVAILABLE_TIME,
    payload,
  };
}

export function setTableAvailableTIme(payload) {
  return {
    type: SET_TABLE_AVAILABLE_TIME,
    payload,
  };
}
