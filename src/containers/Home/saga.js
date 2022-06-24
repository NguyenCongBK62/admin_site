import { put, call, delay, takeLatest } from "redux-saga/effects";
import request from "utils/request";
import { setError, setLoading, fetchNotifyMessage } from "actions/common";
import authMethods from "utils/auth";
import { API_URL } from "settings/config";

import {
  FETCH_RESERVATION_DATA_DAY,
  FETCH_RESERVATION_DATA_WEEK,
  FETCH_RESERVATION_DATA_MONTH,
  FETCH_RESERVATION_DETAILS,
  DELETE_RESERVATION_DETAILS,
  UPDATE_RESERVATION_TRACK_STATUS,
  CHANGE_RESERVATION_STATUS,
  DELETE_NOTIFY_MESSAGES_BY_RESERVATION_ID,
} from "constant";

import {
  setReservationDataDay,
  setReservationDataMonth,
  setReservationDataWeek,
  setReservationDetails,
  changeReservationStatus,
  setIsDeleted,
  deleteNotifyMessagesByReservationId as deleteNotifyMessagesByReservationIdAction,
} from "actions/reservationActions";

function* fetchReservationByDay({ payload, live = false }) {
  yield delay(500);
  const { storeId, day } = payload;
  if (!storeId) {
    yield put(setError("店舗情報を登録してください。"));
  } else {
    if (!live) {
      yield put(setLoading(true));
    }

    const url = "/reservations/getAllByDaySortByTable";
    const options = {
      method: "GET",
      params: {
        storeId,
        day,
      },
    };
    try {
      const response = yield call(request, url, options);
      yield put(setReservationDataDay(response));
      yield put(setLoading(false));
    } catch (e) {
      setError(e);
      yield put(setLoading(false));
    }
  }
}

function* fetchReservationByWeek({ payload, live = false }) {
  yield delay(500);

  const { storeId, day } = payload;
  if (!storeId) {
    yield put(setError("店舗情報を登録してください。"));
  } else {
    if (!live) {
      yield put(setLoading(true));
    }
    const url = "/reservations/getAllByDaySortByTableOfWeek";
    const options = {
      method: "GET",
      params: {
        storeId,
        day,
      },
    };
    try {
      const response = yield call(request, url, options);
      yield put(setReservationDataWeek(response));
      yield put(setLoading(false));
    } catch (e) {
      setError(e);
      yield put(setLoading(false));
    }
  }
}

function* fetchReservationByMonth({ payload, live = false }) {
  yield delay(500);

  const { storeId, day } = payload;
  if (!storeId) {
    yield put(setError("店舗情報を登録してください。"));
  } else {
    if (!live) {
      yield put(setLoading(true));
    }

    const url = "reservations/getAllByMonth/";
    const options = {
      method: "GET",
      params: {
        storeId,
        day,
      },
    };
    try {
      const response = yield call(request, url, options);
      yield put(setReservationDataMonth(response));
      yield put(setLoading(false));
    } catch (e) {
      setError(e);
      yield put(setLoading(false));
    }
  }
}

function* fetchReservationDetails({ id }) {
  yield delay(500);

  yield put(setLoading(true));

  const url = `/reservations/getById/${id}`;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options);
    if (response.data.reservation.hasChangeStatus !== 0) {
      yield put(changeReservationStatus(id));
    }
    yield put(setReservationDetails(response.data));
    yield put(setLoading(false));
  } catch (e) {
    setError(e);
    yield put(setLoading(false));
  }
}

function* deleteReservation({ id }) {
  yield delay(1000);

  yield put(setLoading(true));

  const url = `/reservations/delete/${id}`;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options);
    yield put(setIsDeleted(true));
    yield put(deleteNotifyMessagesByReservationIdAction(id));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* deleteNotifyMessagesByReservationId({ id }) {
  const url = `notify/deleteByReservationId/${id}`;
  const storeId = authMethods.getKey("loginUser.storeId");
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options);
    yield put(fetchNotifyMessage(storeId, 0));
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* updateReservation({ payload }) {
  yield delay(1000);

  yield put(setLoading(true));

  const { id, trackstatus } = payload;
  const url = `reservations/update_track_status?reservationid=${id}&trackstatus=${trackstatus}`;
  const token = authMethods.getToken();

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  try {
    yield call(fetch, API_URL + url, options);
    yield put(setLoading(false));
  } catch (e) {
    setError(e);
    yield put(setLoading(false));
  }
}

function* changeReservation({ id }) {
  yield delay(500);

  yield put(setLoading(true));

  const url = `reservations/updateHasChangeStatus?reservationId=${id}&hasChangeStatus=0`;

  const token = authMethods.getToken();

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  try {
    yield call(fetch, API_URL + url, options);
    yield put(setLoading(false));
  } catch (e) {
    setError(e);
    yield put(setLoading(false));
  }
}

export function* homeWatcher() {
  yield takeLatest(FETCH_RESERVATION_DATA_DAY, fetchReservationByDay);
  yield takeLatest(FETCH_RESERVATION_DATA_WEEK, fetchReservationByWeek);
  yield takeLatest(FETCH_RESERVATION_DATA_MONTH, fetchReservationByMonth);
  yield takeLatest(FETCH_RESERVATION_DETAILS, fetchReservationDetails);
  yield takeLatest(CHANGE_RESERVATION_STATUS, changeReservation);
  yield takeLatest(DELETE_RESERVATION_DETAILS, deleteReservation);
  yield takeLatest(UPDATE_RESERVATION_TRACK_STATUS, updateReservation);
  yield takeLatest(
    DELETE_NOTIFY_MESSAGES_BY_RESERVATION_ID,
    deleteNotifyMessagesByReservationId
  );
}
