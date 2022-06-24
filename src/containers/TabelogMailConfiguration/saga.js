import { call, put, takeLatest } from "@redux-saga/core/effects";
import { setError } from "actions/common";
import { createTabelogSuccess } from "actions/tabelogMailConfig";
import { CONFIG_TABELOG_MAIL } from "constant";
import request from "utils/request";
function* setTabelogmailConfigStatus(payload) {
  const url = "external/create";

  const options = {
    method: "POST",
    data: payload.payload,
  };

  try {
    const response = yield call(request, url, options, false);
    if (response.data) {
      yield put(createTabelogSuccess());
    }
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

export function* tabelogEmailConfigWatcher() {
  yield takeLatest(CONFIG_TABELOG_MAIL, setTabelogmailConfigStatus);
}
