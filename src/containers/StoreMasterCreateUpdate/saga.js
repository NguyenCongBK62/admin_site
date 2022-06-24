import { put, call, takeLatest } from "redux-saga/effects";
import {
  CREATE_STORE,
  EDIT_STORE,
  FETCH_BY_ZIP_CODE,
  FETCH_POSTAL_CODE_DATA,
  FETCH_STORE_BY_ID,
  GENERATE_UUID,
} from "constant";
import request from "utils/request";
import {
  isCreatedStore,
  setPostalCodeData,
  setUUID,
  createStore as createStoreAction,
  editStore as editStoreAction,
  setLoadedStore,
} from "actions/store";
import { setError, setLoading, setSuccessMessage } from "actions/common";

function* searchZipCode({ code }) {
  const url = "postal/searchByZipCode";
  const options = {
    method: "GET",
    params: {
      zipcode: code,
    },
  };

  try {
    const result = yield call(request, url, options, false);
    if (result.data != null && result.data.length > 0) {
      yield put(setPostalCodeData(result.data));
    } else {
      yield put(setPostalCodeData([]));
    }
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* getByZipCode({ data, id }) {
  const zipCode = data.postalCode;
  const url = "postal/getByZipCode";
  const options = {
    method: "GET",
    params: {
      zipcode: zipCode,
    },
  };
  try {
    if (zipCode.length > 0) {
      const result = yield call(request, url, options, false);
      if (result.data != null && result.data != null) {
        !id
          ? yield put(createStoreAction(data))
          : yield put(editStoreAction(data));
      } else {
        yield put(isCreatedStore(null));
        yield put(setError("郵便番号が無効です。 "));
      }
    } else {
      !id
        ? yield put(createStoreAction(data))
        : yield put(editStoreAction(data));
    }
  } catch (e) {
    yield put(setError(e.toString()));
    return true;
  }
}

function* generateUUID() {
  const url = "generateUUID";
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    yield put(setUUID(result.data));
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* createStore({ data }) {
  const url = "stores/create";
  const options = {
    data: data,
    method: "POST",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("登録しました"));
    yield put(isCreatedStore(true));
  } catch (e) {
    yield put(isCreatedStore(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* editStore({ data }) {
  const url = "stores/edit";
  const options = {
    data: data,
    method: "PUT",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("更新しました。"));
    yield put(isCreatedStore(true));
  } catch (e) {
    yield put(isCreatedStore(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* loadStore({ id }) {
  const url = "stores/getStoreById/" + parseInt(id);
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    if (result.data?.isDeleted) {
      yield put(setError("このストアは削除されます"));
      yield put(isCreatedStore(true));
    } else {
      yield put(setLoadedStore(result.data));
      yield put(setLoading(false));
    }
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
  }
}

export function* storeMasterCreateUpdateWatcher() {
  yield takeLatest(FETCH_POSTAL_CODE_DATA, searchZipCode);
  yield takeLatest(GENERATE_UUID, generateUUID);
  yield takeLatest(CREATE_STORE, createStore);
  yield takeLatest(FETCH_BY_ZIP_CODE, getByZipCode);
  yield takeLatest(FETCH_STORE_BY_ID, loadStore);
  yield takeLatest(EDIT_STORE, editStore);
}
