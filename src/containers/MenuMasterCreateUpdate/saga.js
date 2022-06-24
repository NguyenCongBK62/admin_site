import { put, call, takeLatest } from "redux-saga/effects";
import request from "utils/request";
import { CREATE_MENU, FETCH_MENU_DETAILS_BY_ID, UPDATE_MENU } from "constant";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import { setCreatedMenu, setLoadedMenuDetails } from "actions/menu";

function* createMenu({ data }) {
  const url = "menu/create";
  const options = {
    data: data,
    method: "POST",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("登録しました。"));
    yield put(setCreatedMenu(true));
  } catch (e) {
    yield put(setCreatedMenu(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* loadMenuDetails({ id }) {
  const url = "menu/getMenuById/" + id;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    if (!result.data) {
      yield put(setError(result.message));
      yield put(setCreatedMenu(true));
    } else {
      yield put(setLoadedMenuDetails(result.data));
      yield put(setLoading(false));
    }
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
    yield put(setCreatedMenu(true));
  }
}

function* updateMenu({ data }) {
  const url = "menu/update";
  const options = {
    data: data,
    method: "PUT",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("更新しました。"));
    yield put(setCreatedMenu(true));
  } catch (e) {
    yield put(setCreatedMenu(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}
export function* menuMasterCreateUpdateWatcher() {
  yield takeLatest(CREATE_MENU, createMenu);
  yield takeLatest(FETCH_MENU_DETAILS_BY_ID, loadMenuDetails);
  yield takeLatest(UPDATE_MENU, updateMenu);
}
