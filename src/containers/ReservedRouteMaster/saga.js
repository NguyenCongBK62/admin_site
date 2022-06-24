import { put, call, takeLatest } from "redux-saga/effects";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import {
  fetchAllReservedRouteByStoreId,
  setAllReservedRoute,
  setIsCreatedReservedRoute,
} from "actions/reservedRoute";
import {
  DELETE_RESERVED_ROUTE,
  FETCH_ALL_RESERVED_ROUTE_BY_STORE_ID,
  RE_ORDERED_RESERVED_ROUTE,
} from "constant";

import request from "utils/request";

function* getAllReservedRouteByStoreId({ storeId }) {
  if (parseInt(storeId) > 0) {
    yield put(setLoading(true));
    const url = "reserveMethod/getAllByStoreId/" + storeId;
    const options = {
      method: "GET",
      params: {
        storeId: parseInt(storeId),
      },
    };
    try {
      const response = yield call(request, url, options, false);
      yield put(setAllReservedRoute(response.data, false));
      yield put(setLoading(false));
    } catch (e) {
      yield put(setAllReservedRoute(null, false));
      yield put(setError(e.toString()));
      yield put(setLoading(false));
    }
  }
}

function* reOrderRoute({ reOrderedData, storeId }) {
  yield put(setLoading(true));

  const url = "reserveMethod/changeOrder";
  const options = {
    method: "PUT",
    data: reOrderedData,
  };
  try {
    yield call(request, url, options, false);
    yield put(setLoading(false));
    yield put(setSuccessMessage("表示順序が正常に更新されました"));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(fetchAllReservedRouteByStoreId(storeId));
    yield put(setLoading(false));
  }
}

function* deleteReservedRouteId({ ReservedRouteId, storeId }) {
  yield put(setLoading(true));
  const url = "reserveMethod/delete/" + ReservedRouteId;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    yield put(fetchAllReservedRouteByStoreId(storeId));
    yield put(setLoading(false));
    yield put(setSuccessMessage("削除しました。"));
    yield put(setIsCreatedReservedRoute(true));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
    yield put(setIsCreatedReservedRoute(null));
  }
}

export function* reservedRouteMasterWatcher() {
  yield takeLatest(
    FETCH_ALL_RESERVED_ROUTE_BY_STORE_ID,
    getAllReservedRouteByStoreId
  );
  yield takeLatest(RE_ORDERED_RESERVED_ROUTE, reOrderRoute);
  yield takeLatest(DELETE_RESERVED_ROUTE, deleteReservedRouteId);
}
