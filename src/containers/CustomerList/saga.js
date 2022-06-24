import { put, call, takeLatest } from "redux-saga/effects";
import {
  FETCH_CUSTOMER_LIST,
  FETCH_CUSTOMER_BY_CHARACTER,
  FETCH_CUSTOMER_DETAILS,
  DELETE_CUSTOMER,
  GET_CUSTOMER_ADVANCE_SEARCH,
} from "constant";
import request from "utils/request";
import {
  setCustomerList,
  setCustomerDetails,
  setCustomerHistory,
  fetchCustomerList as fetchCustomerListAction,
} from "actions/customers";
import { setLoading, setError } from "actions/common";

function* fetchCustomerList({ payload }) {
  yield put(setLoading(true));

  const { storeID, page } = payload;
  const url = "customers/getAllCustomerByStoreWithPaging";
  const options = {
    method: "GET",
    params: {
      store_id: storeID,
      page: page,
    },
  };

  try {
    const response = yield call(request, url, options);
    yield put(setCustomerList(response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* fetchCustomerByCharacter({ payload }) {
  const { storeID, searchCharacter, page } = payload;
  if (parseInt(storeID) > 0) {
    const url = "customers/searchByFuriganaFirstCharacterWithPaging";
    const options = {
      method: "GET",
      params: {
        storeId: storeID,
        searchCharacter: searchCharacter,
        page: page,
      },
    };

    try {
      yield put(setLoading(true));
      const response = yield call(request, url, options);
      yield put(setCustomerList(response.data));
      yield put(setLoading(false));
    } catch (e) {
      yield put(setError(e.toString()));
      yield put(setLoading(false));
    }
  }
}

function* fetchCustomerAdvanceSearch({ payload }) {
  const { storeID, data } = payload;
  if (parseInt(storeID) > 0) {
    const url = "customers/searchCustomerByFieldsWithPaging";
    const options = {
      method: "POST",
      params: {
        storeId: storeID,
      },
      data,
    };

    try {
      yield put(setLoading(true));
      const response = yield call(request, url, options);
      yield put(setCustomerList(response.data));
      yield put(setLoading(false));
    } catch (e) {
      yield put(setError(e.toString()));
      yield put(setLoading(false));
    }
  }
}

function* fetchCustomerDetails({ payload }) {
  const { id } = payload;

  const url = "customers/getCustomerById/" + id;
  const options = {
    method: "GET",
  };

  try {
    yield put(setLoading(true));
    const response = yield call(request, url, options);
    const urlHistory = "reservations/getAllHistoryByCustomerId/" + id;
    const optionsHistory = {
      method: "GET",
    };
    const responseHistory = yield call(request, urlHistory, optionsHistory);
    yield put(setCustomerDetails(response.data));
    yield put(setCustomerHistory(responseHistory.data));

    yield put(setLoading(false));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

function* deleteCustomer({ payload }) {
  const { id, storeID, page } = payload;

  const url = "customers/deleteCustomer/" + id;
  const options = {
    method: "DELETE",
  };

  try {
    yield put(setLoading(true));
    yield call(request, url, options);
    yield put(fetchCustomerListAction({ storeID, page }));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
  }
}

export function* customerWatcher() {
  yield takeLatest(FETCH_CUSTOMER_LIST, fetchCustomerList);
  yield takeLatest(FETCH_CUSTOMER_BY_CHARACTER, fetchCustomerByCharacter);
  yield takeLatest(GET_CUSTOMER_ADVANCE_SEARCH, fetchCustomerAdvanceSearch);
  yield takeLatest(FETCH_CUSTOMER_DETAILS, fetchCustomerDetails);
  yield takeLatest(DELETE_CUSTOMER, deleteCustomer);
}
