import { put, call, takeLatest } from "redux-saga/effects";
import { FETCH_ACCOUNT_PROFILE, LOGIN } from "constant";
import { setLogin, getAccountProfile, setAccountProfile } from "actions/login";
import request from "utils/request";
import auth from "utils/auth";
import { setError } from "actions/common";

function* login({ username, password }) {
  const url = "oauth/token";
  const options = {
    method: "POST",
    params: {
      username,
      password,
      grant_type: "password",
    },
  };

  try {
    const response = yield call(request, url, options, true);

    auth.setAuthToken(response.data.access_token);
    yield put(getAccountProfile());
  } catch {
    const errorMsg = "ユーザーIDまたはパスワードが違います";
    yield put(setLogin(null, false, errorMsg));
  }
}

function* fetchAccountProfile() {
  const url = "account/profile";
  const options = {
    url: url,
    method: "GET",
  };
  try {
    const response = yield call(request, url, options, false);
    const token = auth.getToken();
    let errorMsg = "";

    auth.setAuthProfile(response.data);
    yield put(setAccountProfile(response.data));
    const role = auth.getKey("loginUser.role");
    const expired = auth.getKey("loginUser.expired");

    if (role !== undefined && role !== "admin") {
      const storeId = auth.getKey("loginUser.storeId");
      if (storeId < 0) {
        errorMsg = "この店舗は現在利用できません。";
        yield put(setLogin(null, false, errorMsg));
        auth.logout();
      } else {
        const storeUrl =
          "stores/getStoreById/" + auth.getKey("loginUser.storeId");
        const options = {
          url: storeUrl,
          method: "GET",
        };
        const response = yield call(request, storeUrl, options, false);
        try {
          if (response.data.status !== 0) {
            errorMsg = "この店舗は現在利用できません。";
            auth.logout();
            yield put(setLogin(null, false, errorMsg));
          } else if (response.data.status === 0) {
            yield put(setLogin(token, false, ""));
          }
        } catch (ex) {
          yield put(setError(ex.toString()));
        }
      }
    } else if (role !== undefined && role === "admin") {
      yield put(setLogin(token, false, ""));
    } else if (expired === "expired") {
      errorMsg = "ユーザーIDの有効期限が切れています。";
      yield put(setLogin(null, false, errorMsg));
      auth.logout();
    } else {
      errorMsg = "ログインが失敗しました。";
      yield put(setLogin(null, false, errorMsg));
      auth.logout();
    }
  } catch (e) {}
}

export function* loginWatcher() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(FETCH_ACCOUNT_PROFILE, fetchAccountProfile);
}
