import { put, call, takeLatest } from "redux-saga/effects";
import {
  CREATE_STAFF_STORE,
  FETCH_STAFF_STORE_DETAILS_BY_ID,
  UPDATE_STAFF_STORE,
} from "constant";
import request from "utils/request";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import {
  setIsCreatedStaffStore,
  setLoadedStaffStoreDetails,
} from "actions/staffStore";

function* createStaffStore({ data }) {
  yield put(setLoading(true));

  const url = "receptionists/create";
  const options = {
    data: data,
    method: "POST",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("登録しました。"));
    yield put(setIsCreatedStaffStore(true));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setIsCreatedStaffStore(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* loadStaffStoreDetails({ id }) {
  yield put(setLoading(true));

  const url = "receptionists/getDetailById/" + id;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    if (!result.data) {
      yield put(setError(result.message));
      yield put(setIsCreatedStaffStore(true));
    } else {
      yield put(setLoadedStaffStoreDetails(result.data));
      yield put(setLoading(false));
    }
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
    yield put(setIsCreatedStaffStore(true));
  }
}

function* updateStaffStore({ data }) {
  yield put(setLoading(true));

  const url = "receptionists/edit";
  const options = {
    data: data,
    method: "PUT",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("更新しました。"));
    yield put(setIsCreatedStaffStore(true));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setIsCreatedStaffStore(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}
export function* staffStoreCreateUpdateWatcher() {
  yield takeLatest(CREATE_STAFF_STORE, createStaffStore);
  yield takeLatest(FETCH_STAFF_STORE_DETAILS_BY_ID, loadStaffStoreDetails);
  yield takeLatest(UPDATE_STAFF_STORE, updateStaffStore);
}
