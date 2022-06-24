import { put, call, takeLatest } from "redux-saga/effects";
import {
  CREATE_TABLE,
  FETCH_TABLE_DETAILS_BY_ID,
  UPDATE_TABLE,
} from "constant";
import request from "utils/request";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import {} from "actions/staffStore";
import { setIsCreatedTable, setLoadedTableDetails } from "actions/table";

function* createTable({ data }) {
  yield put(setLoading(true));
  const url = "tables/create";
  const options = {
    data: data,
    method: "POST",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("登録しました。"));
    yield put(setIsCreatedTable(true));
  } catch (e) {
    yield put(setIsCreatedTable(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* loadTableDetails({ id }) {
  yield put(setLoading(true));
  const url = "table/getTableById/" + id;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    if (!result.data) {
      yield put(setError(result.message));
      yield put(setIsCreatedTable(true));
    } else {
      yield put(setLoadedTableDetails(result.data));
      yield put(setLoading(false));
    }
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
    yield put(setIsCreatedTable(true));
  }
}

function* updateTable({ data }) {
  const url = "tables/update";
  const options = {
    data: data,
    method: "PUT",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("更新しました。"));
    yield put(setIsCreatedTable(true));
  } catch (e) {
    yield put(setIsCreatedTable(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

export function* tableMasterCreateUpdateWatcher() {
  yield takeLatest(CREATE_TABLE, createTable);
  yield takeLatest(FETCH_TABLE_DETAILS_BY_ID, loadTableDetails);
  yield takeLatest(UPDATE_TABLE, updateTable);
}
