import { call, put, takeLatest } from "@redux-saga/core/effects";
import { setError } from "actions/common";
import { setAllMailStatus } from "actions/emailConfig";
import { FETCH_ALL_MAIL_CONFIG, DELETE_MAIL_CONFIG } from "constant";
import request from "utils/request";

function* loadEmailConfigListStatus({ companyCode, storeId }) {
  const url = "external/getEmailStatus";
  const options = {
    method: "GET",
    params: {
      companyCode: companyCode,
      storeId: storeId,
    },
  };

  try {
    const response = yield call(request, url, options, false);
    yield put(setAllMailStatus(response.data));
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* deleteMailConfig({ payload }) {
  const url = "external/delete";
  const options = {
    method: "POST",
    data: payload,
  };

  try {
    const response = yield call(request, url, options, false);
    yield put(setAllMailStatus(response.data));
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

export function* emailConfigWatcher() {
  yield takeLatest(FETCH_ALL_MAIL_CONFIG, loadEmailConfigListStatus);
  yield takeLatest(DELETE_MAIL_CONFIG, deleteMailConfig);
}
