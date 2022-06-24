import { put, call, takeLatest } from "redux-saga/effects";
import {
  DELETE_ACCOUNT,
  FETCH_ALL_ACCOUNT_LIST,
  RE_ORDERED_ACCOUNTS,
} from "constant";
import request from "utils/request";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import {
  fetchAllAccountList,
  setAllAccountList,
  setIsCreatedAccount,
} from "actions/account";

function* getAllAccountList() {
  const url = "account/users";
  const options = {
    method: "GET",
  };

  try {
    const response = yield call(request, url, options, false);
    yield put(setAllAccountList(response, false));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setAllAccountList(null, false));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* reOrderAccounts({ reOrderedData }) {
  const url = "account/changeOrder";
  const options = {
    method: "PUT",
    data: reOrderedData,
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("表示順序が正常に更新されました"));
    yield put(setLoading(false));
  } catch (e) {
    // yield put(setError(e.toString()));
    yield put(fetchAllAccountList());
    yield put(setLoading(false));
  }
}

function* deleteAccount({ id }) {
  const url = "account/users/delete/" + id.toString();
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    yield put(fetchAllAccountList());
    yield put(setSuccessMessage("削除しました。"));
    yield put(setIsCreatedAccount(true));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

export function* accountMasterWatcher() {
  yield takeLatest(FETCH_ALL_ACCOUNT_LIST, getAllAccountList);
  yield takeLatest(RE_ORDERED_ACCOUNTS, reOrderAccounts);
  yield takeLatest(DELETE_ACCOUNT, deleteAccount);
}
