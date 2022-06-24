import { put, call, select, takeLatest } from "redux-saga/effects";
import { DELETE_STORE, GET_MAX_STORE, RE_ORDERED_STORES } from "constant";
import request from "utils/request";
import { getMaxStore, setMaxStore } from "actions/store";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import { fetchAllStores } from "containers/Layout/saga";
import auth from "utils/auth";

// function* getAllStoreDetailByAccount() {
//   const url = "stores/getAllStoreDetailByAccount";
//   const options = {
//     method: "GET",
//   };

//   try {
//     const response = yield call(request, url, options, false);
//     const numLoadStore = response.data.length;
//     yield put(getMaxStore(numLoadStore));
//     yield put(setAllStoreDetailByAccount(response.data));
//     yield put(setLoading(false));
//   } catch (e) {
//     yield put(setLoading(false));
//     yield put(setError(e.toString()));
//     yield put(setAllStoreDetailByAccount(null));
//   }
// }

function* reOrderStores({ reOrderedData }) {
  const url = "stores/changeOrder";
  const options = {
    method: "PUT",
    data: reOrderedData,
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("表示順序が正常に更新されました"));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
    yield* fetchAllStores();
  }
}

function* deleteStore({ storeId }) {
  yield put(setLoading(true));
  const url = "stores/delete/" + parseInt(storeId);
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    if (storeId.toString() === auth.getKey("loginUser.storeId")) {
      auth.setKey("loginUser.storeId", -1);
    }
    yield* fetchAllStores();

    const stores = yield select((state) => state.layoutReducer.stores);
    const numLoadStore = stores.length;
    yield put(getMaxStore(numLoadStore));

    yield put(setSuccessMessage("削除しました。"));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
  }
}

function* loadStoreList({ numLoadStore }) {
  const url = "stores/countMaxStore";
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options, false);
    if (numLoadStore < response.data) {
      yield put(setMaxStore(true));
    } else {
      yield put(setMaxStore(false));
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
  }
}
export function* storeMasterWatcher() {
  yield takeLatest(RE_ORDERED_STORES, reOrderStores);
  yield takeLatest(DELETE_STORE, deleteStore);
  yield takeLatest(GET_MAX_STORE, loadStoreList);
}
