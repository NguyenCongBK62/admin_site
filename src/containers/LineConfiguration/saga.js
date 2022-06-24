import { put, call, takeLatest } from "redux-saga/effects";
import { setError, setLoading } from "actions/common";
import {
  setLineBotInfo,
  setLineConfigByStoreId,
  setWebhookInfo,
  fetchLineConfigByStoreId as fetchLineConfigByStoreIdAction,
  setIsCreatedLineConfig,
} from "actions/lineConfig";
import {
  CREATE_LINE_CONFIG,
  DELETE_LINE_CONFIG,
  FETCH_LINE_BOT_INFO,
  FETCH_LINE_CONFIG_BY_STORE_ID,
  FETCH_WEBHOOK_INFO,
} from "constant";
import request from "utils/request";

function* createLineConfig({ data }) {
  const url = "/lineConfig/createLineConfig";
  const options = {
    method: "POST",
    data: data,
  };
  try {
    yield call(request, url, options);
    yield put(setLoading(false));
    yield put(setIsCreatedLineConfig(true));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* fetchLineConfigByStoreId({ storeId }) {
  const url = "/lineConfig/getLineConfigByStoreId/" + storeId;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options);
    yield put(setLineConfigByStoreId(response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* fetchLineBotInfo({ accessToken }) {
  const url = "/lineConfig/getLineBotInfoByChannelAccessToken";
  const options = {
    method: "GET",
    params: {
      token: accessToken,
    },
  };
  try {
    const response = yield call(request, url, options, false);
    yield put(setLineBotInfo(response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* deleteLineConfig({ id, storeId }) {
  const url = "/lineConfig/deleteLineConfig/" + id;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    yield put(setLineBotInfo([]));
    yield put(setLoading(false));
    yield put(fetchLineConfigByStoreIdAction(storeId));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* checkWebhookValidity({ accessToken }) {
  const url = "/lineConfig/getLineWebhookInfoByChannelAccessToken";
  const options = {
    method: "GET",
    params: {
      token: accessToken,
    },
  };
  try {
    const response = yield call(request, url, options, false);
    yield put(setWebhookInfo(response.data));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}
export function* lineConfigWatcher() {
  yield takeLatest(CREATE_LINE_CONFIG, createLineConfig);
  yield takeLatest(FETCH_LINE_CONFIG_BY_STORE_ID, fetchLineConfigByStoreId);
  yield takeLatest(FETCH_LINE_BOT_INFO, fetchLineBotInfo);
  yield takeLatest(DELETE_LINE_CONFIG, deleteLineConfig);
  yield takeLatest(FETCH_WEBHOOK_INFO, checkWebhookValidity);
}
