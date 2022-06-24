import { put, call, takeLatest } from "redux-saga/effects";
import request from "utils/request";
import {
  CREATE_RESERVED_ROUTE,
  FETCH_RESERVED_ROUTE_DETAILS_BY_ID,
  UPDATE_RESERVED_ROUTE,
} from "constant";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import {
  setIsCreatedReservedRoute,
  setReservedRouteDetails,
} from "actions/reservedRoute";

function* createReservedRoute({ data }) {
  yield put(setLoading(true));
  const url = "reserveMethod/create";
  const options = {
    data: data,
    method: "POST",
  };
  try {
    yield call(request, url, options, false);
    yield put(setLoading(false));
    yield put(setSuccessMessage("登録しました。"));
    yield put(setIsCreatedReservedRoute(true));
  } catch (e) {
    yield put(setIsCreatedReservedRoute(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* loadDetails({ id }) {
  yield put(setLoading(true));
  const url = "reserveMethod/getDetailById/" + id;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    if (!result.data) {
      yield put(setError(result.message));
      yield put(setIsCreatedReservedRoute(true));
      yield put(setLoading(false));
    } else {
      yield put(setReservedRouteDetails(result.data));
      yield put(setLoading(false));
    }
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
    yield put(setIsCreatedReservedRoute(true));
  }
}

function* updateDetails({ data }) {
  yield put(setLoading(true));
  const url = "reserveMethod/edit";
  const options = {
    data: data,
    method: "PUT",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("更新しました。"));
    yield put(setLoading(false));
    yield put(setIsCreatedReservedRoute(true));
  } catch (e) {
    yield put(setIsCreatedReservedRoute(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

export function* reservedRouteMasterCreateUpdateWatcher() {
  yield takeLatest(CREATE_RESERVED_ROUTE, createReservedRoute);
  yield takeLatest(FETCH_RESERVED_ROUTE_DETAILS_BY_ID, loadDetails);
  yield takeLatest(UPDATE_RESERVED_ROUTE, updateDetails);
}
