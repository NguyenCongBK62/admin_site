import { put, call, takeLatest } from "redux-saga/effects";
import {
  DELETE_CUSTOM_ITEM,
  FETCH_CUSTOM_ITEMS,
  RE_ORDERED_CUSTOM_ITEMS,
} from "constant";
import {
  setCustomItems,
  fetchCustomItems as fetchCustomItemsAction,
} from "actions/customItemsAction";
import { setLoading, setError, setSuccessMessage } from "actions/common";
import request from "utils/request";

function* fetchCustomItems({ storeId }) {
  if (parseInt(storeId) > 0) {
    yield put(setLoading(true));
    const url = "customField/list/" + parseInt(storeId);
    const option = {
      method: "GET",
      params: {
        storeId: storeId,
      },
    };

    try {
      const response = yield call(request, url, option);
      yield put(setLoading(false));
      yield put(setCustomItems(response));
    } catch (e) {
      yield put(setLoading(false));
      yield put(setError(e.toString()));
    }
  }
}

function* deleteCustomItem({ customItemId, storeId }) {
  yield put(setLoading(true));
  const url = "customField/delete/" + customItemId;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    yield put(setLoading(false));
    yield put(fetchCustomItemsAction(storeId));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
    yield put(setError("何かがうまくいかなかった "));
  }
}

function* reOrderCustomItems({ reOrderedData, storeId }) {
  yield put(setLoading(true));
  const url = "customField/changeOrder";
  const options = {
    method: "PUT",
    data: reOrderedData,
  };
  try {
    yield call(request, url, options, false);
    yield put(setLoading(false));
    yield put(setSuccessMessage("表示順序が正常に更新されました"));
  } catch (e) {
    // yield put(fetchCustomItemsAction(storeId));
    yield put(setLoading(false));
    yield put(setError("何かがうまくいかなかった "));
  }
}

export function* customItemsWatcher() {
  yield takeLatest(FETCH_CUSTOM_ITEMS, fetchCustomItems);
  yield takeLatest(DELETE_CUSTOM_ITEM, deleteCustomItem);
  yield takeLatest(RE_ORDERED_CUSTOM_ITEMS, reOrderCustomItems);
}
