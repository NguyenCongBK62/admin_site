import { put, call, takeLatest, delay } from "redux-saga/effects";
import {
  CREATE_NET_RESERVATION,
  FETCH_HOLIDAYS,
  FETCH_STORE_DETAILS_BY_UUID,
  FETCH_TABLE_AVAILABLE_TIME,
} from "constant";
import {
  setStoreDetails,
  setHolidays,
  setTableAvailableTIme,
  setNetCreated,
} from "actions/netReservation";
import request from "utils/request";
import { setError, setLoading } from "actions/common";

function* createNetReservation({ payload }) {
  delay(500);
  yield put(setLoading(true));
  const url = "reservations/createNetReservation";
  const options = {
    method: "POST",
    data: payload,
  };
  try {
    yield call(request, url, options, true);
    yield put(setNetCreated(true));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
  }
}

function* fetchAvailableTable({ payload }) {
  const { storeId, startTime, endTime } = payload;
  yield put(setLoading(true));
  const url = "tables/getAvailableTableOfMonthByStoreAndTime";
  const options = {
    method: "GET",
    params: { storeId, startTime, endTime },
  };
  try {
    const response = yield call(request, url, options, true);
    yield put(setTableAvailableTIme(response.data));

    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
  }
}

function* fetchStoreByUUID({ payload }) {
  const { id } = payload;
  yield put(setLoading(true));
  const url = "stores/getStoreByUUID/" + id;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options, true);
    yield put(setStoreDetails(response.data));
    if (response?.data?.id) {
      yield fetchHolidays({ payload: { id: response.data.id } });
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    // yield put(setError(e.toString()));
    yield put(setStoreDetails(-1));
  }
}

function* fetchHolidays({ payload }) {
  const { id } = payload;
  yield put(setLoading(true));
  const url = "holidays/getAllHolidaysByStoreId/" + id;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options, true);
    yield put(setHolidays(response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
  }
}

export function* netReservationWatcher() {
  yield takeLatest(CREATE_NET_RESERVATION, createNetReservation);
  yield takeLatest(FETCH_HOLIDAYS, fetchHolidays);

  yield takeLatest(FETCH_STORE_DETAILS_BY_UUID, fetchStoreByUUID);
  yield takeLatest(FETCH_TABLE_AVAILABLE_TIME, fetchAvailableTable);
}
