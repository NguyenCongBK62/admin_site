import { call, put, takeLatest } from "@redux-saga/core/effects";
import { setError } from "actions/common";
import { createGnaviSuccess } from "actions/gnaviMailConfig";
import { CONFIG_GNAVI_MAIL } from "constant";
import request from "utils/request";
function* setGnavimailConfigStatus(payload) {
  const url = "external/create";

  const options = {
    method: "POST",
    data: payload.payload,
  };

  try {
    const response = yield call(request, url, options, false);
    if (response.data) {
      yield put(createGnaviSuccess());
    }
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

export function* gnaviEmailConfigWatcher() {
  yield takeLatest(CONFIG_GNAVI_MAIL, setGnavimailConfigStatus);
}
