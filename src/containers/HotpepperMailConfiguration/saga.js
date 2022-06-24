import { call, put, takeLatest } from "@redux-saga/core/effects";
import { setError } from "actions/common";
import { createHotpepperSuccess } from "actions/hotpepperMailConfig";
import { CONFIG_HOTPEPPER_MAIL } from "constant";
import request from "utils/request";
function* setHotpeppermailConfigStatus(payload) {
  const url = "external/create";

  const options = {
    method: "POST",
    data: payload.payload,
  };

  try {
    const response = yield call(request, url, options, false);
    if (response.data) {
      yield put(createHotpepperSuccess());
    }
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

export function* hotpepperEmailConfigWatcher() {
  yield takeLatest(CONFIG_HOTPEPPER_MAIL, setHotpeppermailConfigStatus);
}
