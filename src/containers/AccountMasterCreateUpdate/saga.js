import { put, call, takeLatest } from "redux-saga/effects";
import {
  CREATE_ACCOUNT_USER,
  FETCH_ACCOUNT_DETAILS_BY_USER_ID,
  UPDATE_ACCOUNT_USER,
} from "constant";
import request from "utils/request";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import { setIsCreatedAccount, setLoadedAccountDetails } from "actions/account";

function* createAccountUser({ data }) {
  const url = "account/users/register";
  const options = {
    data: data,
    method: "POST",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("登録しました"));
    yield put(setIsCreatedAccount(true));
  } catch (e) {
    yield put(setIsCreatedAccount(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* loadAccountDetails({ id }) {
  const url = "account/details/" + String(id);
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, url, options, false);
    if (!result.data) {
      yield put(setError("入力したアカウントIDは存在しません。"));
      yield put(setIsCreatedAccount(true));
    } else {
      yield put(setLoadedAccountDetails(result.data));
      yield put(setLoading(false));
    }
  } catch (e) {
    console.log(e);
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* updateAccountUser({ data }) {
  const url = "account/users/update";
  const options = {
    data: data,
    method: "PUT",
  };
  try {
    yield call(request, url, options, false);
    yield put(setSuccessMessage("更新しました。"));
    yield put(setIsCreatedAccount(true));
  } catch (e) {
    yield put(setIsCreatedAccount(null));
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}
export function* accountMasterCreateUpdateWatcher() {
  yield takeLatest(CREATE_ACCOUNT_USER, createAccountUser);
  yield takeLatest(FETCH_ACCOUNT_DETAILS_BY_USER_ID, loadAccountDetails);
  yield takeLatest(UPDATE_ACCOUNT_USER, updateAccountUser);
}
