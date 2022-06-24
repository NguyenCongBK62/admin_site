import { setError, setLoading, setSuccessMessage } from "actions/common";
import {
  setIsCreatedItems,
  setLoadedItemsDetails,
} from "actions/customItemsAction";
import {
  CREATE_CUSTOM_ITEMS,
  FETCH_CUSTOM_ITEMS_DETAILS,
  UPDATE_CUSTOM_ITEMS,
} from "constant";
import { put, call, takeLatest } from "redux-saga/effects";
import request from "utils/request";

function* createCustomItems({ data }) {
  yield put(setLoading(true));

  const url = "customField/create";
  const options = {
    data: data,
    method: "POST",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("登録しました"));
    yield put(setIsCreatedItems(true));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* updateCustomItems({ data }) {
  yield put(setLoading(true));

  const url = "customField/edit";
  const options = {
    data: data,
    method: "PUT",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("更新しました。"));
    yield put(setIsCreatedItems(true));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setIsCreatedItems(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* loadCustomItemsDetails({ id }) {
  yield put(setLoading(true));
  const url = "customField/" + String(id);
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    if (!result.data) {
      yield put(setError("入力したアカウントIDは存在しません。"));
      // yield put(setIsCreatedAccount(true));
    } else {
      yield put(setLoadedItemsDetails(result.data));
      yield put(setLoading(false));
    }
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

export function* customItemCreateUpdateWatcher() {
  yield takeLatest(CREATE_CUSTOM_ITEMS, createCustomItems);
  yield takeLatest(UPDATE_CUSTOM_ITEMS, updateCustomItems);
  yield takeLatest(FETCH_CUSTOM_ITEMS_DETAILS, loadCustomItemsDetails);
}
