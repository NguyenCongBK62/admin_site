import {
  FETCH_RESERVATION_DATA_DAY,
  SET_RESERVATION_DATA_DAY,
  FETCH_RESERVATION_DATA_WEEK,
  SET_RESERVATION_DATA_WEEK,
  FETCH_RESERVATION_DATA_MONTH,
  SET_RESERVATION_DATA_MONTH,
  FETCH_RESERVATION_DETAILS,
  DELETE_RESERVATION_DETAILS,
  UPDATE_RESERVATION_TRACK_STATUS,
  CHANGE_RESERVATION_STATUS,
  SET_RESERVATION_DETAILS,
  SET_IS_DELETED,
  DELETE_NOTIFY_MESSAGES_BY_RESERVATION_ID,
  SET_CURRENT_GANTT_VIEW,
} from "constant";

export function fetchReservationDataDay(storeId, day, live = false) {
  return {
    type: FETCH_RESERVATION_DATA_DAY,
    payload: {
      storeId,
      day,
    },
    live,
  };
}

export function setReservationDataDay(payload) {
  return {
    type: SET_RESERVATION_DATA_DAY,
    payload,
  };
}

export function fetchReservationDataWeek(storeId, day, live = false) {
  return {
    type: FETCH_RESERVATION_DATA_WEEK,
    payload: {
      storeId,
      day,
    },
    live,
  };
}

export function setReservationDataWeek(payload) {
  return {
    type: SET_RESERVATION_DATA_WEEK,
    payload,
  };
}

export function fetchReservationDataMonth(storeId, day, live = false) {
  return {
    type: FETCH_RESERVATION_DATA_MONTH,
    payload: {
      storeId,
      day,
    },
    live,
  };
}

export function setReservationDataMonth(payload) {
  return {
    type: SET_RESERVATION_DATA_MONTH,
    payload,
  };
}

export function fetchReservationDetails(id) {
  return {
    type: FETCH_RESERVATION_DETAILS,
    id,
  };
}

export function changeReservationStatus(id) {
  return {
    type: CHANGE_RESERVATION_STATUS,
    id,
  };
}

export function updateReservationTrack(id, trackstatus) {
  return {
    type: UPDATE_RESERVATION_TRACK_STATUS,
    payload: {
      id,
      trackstatus,
    },
  };
}

export function deleteReservation(id) {
  return {
    type: DELETE_RESERVATION_DETAILS,
    id,
  };
}

export function deleteNotifyMessagesByReservationId(id) {
  return {
    type: DELETE_NOTIFY_MESSAGES_BY_RESERVATION_ID,
    id,
  };
}

export function setIsDeleted(payload) {
  return {
    type: SET_IS_DELETED,
    payload,
  };
}

export function setReservationDetails(payload) {
  return {
    type: SET_RESERVATION_DETAILS,
    payload,
  };
}

export function setView(payload) {
  return {
    type: SET_CURRENT_GANTT_VIEW,
    payload,
  };
}
