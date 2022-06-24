import { put, call, takeLatest } from "redux-saga/effects";
import { RE_ORDERED_CUSTOMER_CUSTOM_FIELD } from "constant";
import request from "utils/request";
import {
  fetchCustomerCustomItemOrder,
  setCustomerCustomItemOrder,
  setError,
  setLoading,
} from "actions/common";

function* reOrderCustomerCustomField({ reOrderedData, storeId }) {
  const url = "customField/customer/changeOrder";
  const options = {
    method: "PUT",
    data: reOrderedData,
  };
  try {
    const response = yield call(request, url, options, false);
    yield put(setLoading(false));
    yield put(setCustomerCustomItemOrder(response.data));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(fetchCustomerCustomItemOrder({ storeId }));
    yield put(setLoading(false));
  }
}

export function* orderCustomerListWatcher() {
  yield takeLatest(
    RE_ORDERED_CUSTOMER_CUSTOM_FIELD,
    reOrderCustomerCustomField
  );
}
