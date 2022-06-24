import { put, call, takeLatest } from "redux-saga/effects";
import { setLoading, setError } from "actions/common";
import {
  setCustomerStatus,
  setCustomerForm,
  setCustomerDetails,
} from "actions/customers";
import {
  FETCH_CUSTOMER_STATUS,
  SUBMIT_CUSTOMER_FORM,
  UPDATE_CUSTOMER_FORM,
} from "constant";

import request from "utils/request";

function* fetchCustomerStatus() {
  const url = `/customers/findAllCustomerStatus`;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options);
    yield put(setCustomerStatus(response.data));
  } catch (ex) {
    yield put(setError(ex.toString()));
  }
}

function* submitForm({ payload }) {
  yield put(setLoading(true));
  const { customerData, customFieldsData } = payload;
  let url = `/customers/createCustomer`;
  const options = {
    method: "POST",
    data: customerData,
  };
  try {
    const response = yield call(request, url, options);
    url = `/customFieldContent/createFromCustomer`;
    options.data = { content: customFieldsData, customerId: response.data.id };
    yield call(request, url, options);
    yield put(setCustomerForm(true));
    yield put(setLoading(false));
  } catch (ex) {
    yield put(setError(ex.toString()));
    yield put(setLoading(false));
  }
}

function* submitEditForm({ payload }) {
  yield put(setLoading(true));
  const { customerData, customFieldsData, customerId } = payload;
  let url = `/customers/editCustomer`;
  const options = {
    method: "PUT",
    data: customerData,
  };
  try {
    yield call(request, url, options);
    url = `/customFieldContent/editFromCustomer`;
    options.data = { content: customFieldsData, customerId };
    options.method = "POST";
    yield call(request, url, options);
    yield put(setCustomerDetails({}));

    yield put(setCustomerForm(true));
    yield put(setLoading(false));
  } catch (ex) {
    yield put(setError(ex.toString()));
    yield put(setLoading(false));
  }
}

export function* customerCreateWatcher() {
  yield takeLatest(FETCH_CUSTOMER_STATUS, fetchCustomerStatus);
  yield takeLatest(SUBMIT_CUSTOMER_FORM, submitForm);
  yield takeLatest(UPDATE_CUSTOMER_FORM, submitEditForm);
}
