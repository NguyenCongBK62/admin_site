import { put, call, takeLatest } from "redux-saga/effects";
import {
  DELETE_STAFF_STORE,
  FETCH_ALL_STAFF_STORES_BY_STORE_ID,
  RE_ORDERED_STAFF_STORES,
} from "constant";
import request from "utils/request";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import {
  fetchAllstaffStoresByStoreId,
  setAllstaffStores,
  setIsCreatedStaffStore,
} from "actions/staffStore";

function* getAllStaffStoresByStoreId({ storeId }) {
  const url = "receptionists/getAllByStoreId/" + storeId;
  const options = {
    method: "GET",
  };

  try {
    const response = yield call(request, url, options, false);
    yield put(setAllstaffStores(response, false));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setAllstaffStores(null, false));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* reOrderStaffStores({ reOrderedData, storeId }) {
  const url = "receptionists/changeOrder";
  const options = {
    method: "PUT",
    data: reOrderedData,
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("表示順序が正常に更新されました"));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(fetchAllstaffStoresByStoreId(storeId));
    yield put(setLoading(false));
  }
}

function* deleteStaffStore({ staffId, storeId }) {
  const url = "receptionists/delete/" + staffId;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    yield put(fetchAllstaffStoresByStoreId(storeId));
    yield put(setSuccessMessage("削除しました。"));
    yield put(setIsCreatedStaffStore(true));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
    yield put(setIsCreatedStaffStore(true));
  }
}

export function* staffStoreMasterWatcher() {
  yield takeLatest(
    FETCH_ALL_STAFF_STORES_BY_STORE_ID,
    getAllStaffStoresByStoreId
  );
  yield takeLatest(RE_ORDERED_STAFF_STORES, reOrderStaffStores);
  yield takeLatest(DELETE_STAFF_STORE, deleteStaffStore);
}
