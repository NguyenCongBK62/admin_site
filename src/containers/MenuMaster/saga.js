import { put, call, takeLatest } from "redux-saga/effects";
import { DELETE_MENU, FETCH_ALL_MENU_LIST, RE_ORDERED_MENUS } from "constant";
import request from "utils/request";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import { fetchAllMenuList, setAllMenuList, setCreatedMenu } from "actions/menu";

function* getAllMenuByStoreId({ storeId }) {
  if (parseInt(storeId) > 0) {
    const url = "menu/getAllMenuByAccount";
    const options = {
      method: "GET",
      params: {
        storeId: parseInt(storeId),
      },
    };

    try {
      const response = yield call(request, url, options, false);
      yield put(setAllMenuList(response));
      yield put(setLoading(false));
    } catch (e) {
      yield put(setAllMenuList(null));
      yield put(setError(e.toString()));
      yield put(setLoading(false));
    }
  }
}

function* reOrderMenus({ reOrderedData, storeId }) {
  const url = "menu/changeOrder";
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
    yield put(fetchAllMenuList(storeId));
    yield put(setLoading(false));
  }
}

function* deleteMenu({ menuId, storeId }) {
  const url = "menu/delete/" + menuId;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    yield put(fetchAllMenuList(storeId));
    yield put(setSuccessMessage("削除しました。"));
    yield put(setCreatedMenu(true));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
    yield put(setCreatedMenu(true));
  }
}

export function* menuMasterWatcher() {
  yield takeLatest(FETCH_ALL_MENU_LIST, getAllMenuByStoreId);
  yield takeLatest(RE_ORDERED_MENUS, reOrderMenus);
  yield takeLatest(DELETE_MENU, deleteMenu);
}
