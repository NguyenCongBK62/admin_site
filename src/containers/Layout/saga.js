import { put, call, takeLatest, select, delay } from "redux-saga/effects";
import _ from "lodash";
import {
  GET_NOTIFY_MESSAGE_PAGING,
  FETCH_STORE_DATA,
  FETCH_CUSTOMER_CUSTOM_ITEM_ORDER,
  FETCH_CUSTOM_ITEM_ORDER,
  FETCH_NET_RESERVATION_UNCONFIRMED_BY_STOREID,
  FETCH_STORE_BY_UUID,
  DELETE_NOTIFICATION_BY_ID,
  UPDATE_NOTIFICATION_BY_ID,
  UPDATE_NOTIFICATION_OLD,
} from "constant";
import request from "utils/request";
import {
  setStores,
  setError,
  setNotifications,
  setSelectedStore,
  setCustomerCustomItemOrder,
  setCustomItemOrder,
  setNetReservationUnconfirmedByStoreId,
  setLoading,
  setStoreUUID,
} from "actions/common";
import { setAccountProfile } from "actions/login";
import auth from "utils/auth";

export function* fetchAllStores() {
  yield put(setLoading(true));

  const url = "stores/getAllStoreDetailByAccount";
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options);
    const profile = yield select((state) => state.loginReducer.profile);
    const stores = response?.data.filter((s) => s.status === 0);
    yield put(setStores(stores));

    if (stores.length === 0) {
      yield put(setError("店舗情報を登録してください。"));
    } else {
      const storeId = parseInt(auth.getKey("loginUser.storeId"));

      if (storeId > 0) {
        const filteredData = stores.filter(
          (item) => item.id.toString() === storeId.toString()
        );
        if (filteredData.length) {
          yield put(
            setAccountProfile({
              ...profile,
              storeId: filteredData[0].id,
            })
          );
          yield put(setSelectedStore(filteredData[0]));
          yield getStoreByUUID({ payload: { id: filteredData[0].id } });
        }
      } else {
        if (stores.length) {
          auth.setKey("loginUser.storeId", stores[0].id);

          yield put(
            setAccountProfile({
              ...profile,
              storeId: stores[0].id,
            })
          );
          yield put(setSelectedStore(stores[0]));
          yield getStoreByUUID({ payload: { id: stores[0].id } });
        } else {
          yield put(setAccountProfile(profile));
        }
      }
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    yield put(setError(e.toString()));
  }
}

export function* getStoreByUUID({ payload }) {
  const { id } = payload;
  const url = `stores/getUUID/${id}`;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options);
    yield put(setStoreUUID(response.data));
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* fetchNotifyMessage({
  storeId,
  page = 0,
  newNotification = false,
  old = false,
}) {
  yield delay(1000);

  let pageSelected = page;
  let url = "";
  let options = {};
  const notifications = yield select(
    (state) => state.layoutReducer.notifications
  );
  if (newNotification) {
    url = "notify/getNewNotifyMessage/" + storeId;
    options = {
      method: "GET",
    };
  } else if (old) {
    pageSelected = Math.floor(notifications.lstMessageNotify.length / 5);
    url = "notify/getOldNotifyMessagePaging/";
    options = {
      method: "GET",
      params: {
        storeId,
        page: pageSelected,
      },
    };
  } else {
    url = "notify/getNotifyMessagePaging/";
    options = {
      method: "GET",
      params: {
        storeId,
        page: pageSelected,
      },
    };
  }

  try {
    const response = yield call(request, url, options);
    if (old) {
      const temp = {
        ...notifications,
        lstMessageNotify: [
          ...notifications.lstMessageNotify,
          ..._.filter(response.data, (n) => {
            if (
              _.find(notifications.lstMessageNotify, (m) => m.id === n.id)?.id
            ) {
              return false;
            }
            return true;
          }),
        ],
      };
      yield put(setNotifications(temp));
    } else if (newNotification) {
      const temp = {
        totalNewMsg: response.data.totalNewMsg,
        lstMessageNotify: [
          ...response.data.lstMessageNotify,
          ...notifications.lstMessageNotify,
        ],
      };
      yield put(setNotifications(temp));
    } else {
      yield put(setNotifications(response.data));
    }
  } catch (e) {
    setError(e);
  }
}

function* updateOldNotification({ payload }) {
  const { id } = payload;
  const storeId = auth.getKey("loginUser.storeId");

  const url = "/notify/updateNotifyMessageOld/" + id;
  const options = {
    method: "GET",
  };
  try {
    yield call(request, url, options);
    yield fetchNotifyMessage({ storeId, page: 0 });
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* fetchNetReservationUnconfirmedByStoreId({ storeId }) {
  const url = "reservations/getNetReservationUnconfirmedByStoreId/" + storeId;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options);
    yield put(setNetReservationUnconfirmedByStoreId(response.data));
  } catch (e) {
    setError(e);
  }
}

function* fetchCustomerCustomItemOrder({ payload }) {
  const { storeID } = payload;
  const url = "customField/customer/displayOrder/" + storeID;
  const options = {
    method: "GET",
  };

  try {
    const response = yield call(request, url, options);
    yield put(setCustomerCustomItemOrder(response.data));
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* fetchCustomItemOrder({ payload }) {
  const { storeID } = payload;
  if (parseInt(storeID) > 0) {
    const url = "customField/list/" + storeID;
    const options = {
      method: "GET",
    };

    try {
      const response = yield call(request, url, options);
      yield put(setCustomItemOrder(response.data));
    } catch (e) {
      yield put(setError(e.toString()));
    }
  }
}

function* deleteNotification({ payload }) {
  const { id } = payload;
  const storeId = auth.getKey("loginUser.storeId");

  const url = "notify/delete/" + id;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options);
    yield fetchNotifyMessage({ storeId, page: 0 });
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

function* updateNotification({ payload }) {
  const { id } = payload;
  const storeId = auth.getKey("loginUser.storeId");

  const url = "/notify/updateNotifyMessageWatched/" + id;
  const options = {
    method: "GET",
  };
  try {
    yield call(request, url, options);
    yield fetchNotifyMessage({ storeId, page: 0 });
  } catch (e) {
    yield put(setError(e.toString()));
  }
}

export function* layoutWatcher() {
  yield takeLatest(GET_NOTIFY_MESSAGE_PAGING, fetchNotifyMessage);
  yield takeLatest(FETCH_STORE_DATA, fetchAllStores);
  yield takeLatest(
    FETCH_CUSTOMER_CUSTOM_ITEM_ORDER,
    fetchCustomerCustomItemOrder
  );
  yield takeLatest(FETCH_CUSTOM_ITEM_ORDER, fetchCustomItemOrder);
  yield takeLatest(
    FETCH_NET_RESERVATION_UNCONFIRMED_BY_STOREID,
    fetchNetReservationUnconfirmedByStoreId
  );
  yield takeLatest(FETCH_STORE_BY_UUID, getStoreByUUID);
  yield takeLatest(DELETE_NOTIFICATION_BY_ID, deleteNotification);
  yield takeLatest(UPDATE_NOTIFICATION_BY_ID, updateNotification);
  yield takeLatest(UPDATE_NOTIFICATION_OLD, updateOldNotification);
}
