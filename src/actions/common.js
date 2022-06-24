import {
  TOGGLE_COLLAPSE,
  TOGGLE_BACKDROP,
  SET_ERROR,
  GET_ERROR,
  SET_SUCCESS_MESSAGE,
  GET_SUCCESS_MESSAGE,
  GET_SELECTED_STORE,
  SET_SELECTED_STORE,
  SET_STORES,
  GET_NOTIFY_MESSAGE_PAGING,
  SET_NOTIFICATIONS,
  FETCH_STORE_DATA,
  SET_LOADING,
  FETCH_CUSTOMER_CUSTOM_ITEM_ORDER,
  SET_CUSTOMER_CUSTOM_ITEM_ORDER,
  FETCH_CUSTOM_ITEM_ORDER,
  SET_CUSTOM_ITEM_ORDER,
  FETCH_NET_RESERVATION_UNCONFIRMED_BY_STOREID,
  SET_NET_RESERVATION_UNCONFIRMED_BY_STOREID,
  SET_UUID,
  FETCH_STORE_BY_UUID,
  SET_IPHONE,
  SET_SHOW_SECOND_HEADER,
  DELETE_NOTIFICATION_BY_ID,
  UPDATE_NOTIFICATION_BY_ID,
  UPDATE_NOTIFICATION_OLD,
} from "constant";

export function toggleCollapse() {
  return {
    type: TOGGLE_COLLAPSE,
  };
}

export function toggleBackdrop(payload = null) {
  return {
    type: TOGGLE_BACKDROP,
    payload,
  };
}

export function setError(err) {
  return {
    type: SET_ERROR,
    payload: err,
  };
}

export function getError() {
  return {
    type: GET_ERROR,
  };
}

export function setSuccessMessage(err) {
  return {
    type: SET_SUCCESS_MESSAGE,
    payload: err,
  };
}

export function getSuccessMessage() {
  return {
    type: GET_SUCCESS_MESSAGE,
  };
}

export function getSelectedStore(selectedStoreId, selectedStoreName) {
  return {
    type: GET_SELECTED_STORE,
  };
}

export function setSelectedStore(selectedStore) {
  return {
    type: SET_SELECTED_STORE,
    payload: selectedStore,
  };
}

export function setStores(stores) {
  return {
    type: SET_STORES,
    payload: stores,
  };
}

export function fetchNotifyMessage(
  storeId,
  page,
  newNotification = false,
  old = false
) {
  return {
    type: GET_NOTIFY_MESSAGE_PAGING,
    storeId,
    page,
    newNotification,
    old,
  };
}

export function setNotifications(notifications) {
  return {
    type: SET_NOTIFICATIONS,
    payload: notifications,
  };
}

export function fetchNetReservationUnconfirmedByStoreId(storeId) {
  return {
    type: FETCH_NET_RESERVATION_UNCONFIRMED_BY_STOREID,
    storeId,
  };
}

export function setNetReservationUnconfirmedByStoreId(
  netReservationUncofirmed
) {
  return {
    type: SET_NET_RESERVATION_UNCONFIRMED_BY_STOREID,
    payload: netReservationUncofirmed,
  };
}

export function fetchAllStores() {
  return {
    type: FETCH_STORE_DATA,
  };
}

export function setLoading(payload) {
  return {
    type: SET_LOADING,
    payload,
  };
}

export function fetchCustomerCustomItemOrder(payload) {
  return {
    type: FETCH_CUSTOMER_CUSTOM_ITEM_ORDER,
    payload,
  };
}

export function setCustomerCustomItemOrder(payload) {
  return {
    type: SET_CUSTOMER_CUSTOM_ITEM_ORDER,
    payload,
  };
}

export function fetchCustomItemOrder(payload) {
  return {
    type: FETCH_CUSTOM_ITEM_ORDER,
    payload,
  };
}

export function setCustomItemOrder(payload) {
  return {
    type: SET_CUSTOM_ITEM_ORDER,
    payload,
  };
}

export function fetchStoreUUID(id) {
  return {
    type: FETCH_STORE_BY_UUID,
    payload: { id },
  };
}

export function setStoreUUID(payload) {
  return {
    type: SET_UUID,
    payload,
  };
}

export function setIphone(payload) {
  return {
    type: SET_IPHONE,
    payload,
  };
}

export function setShowSecondHeader(payload) {
  return {
    type: SET_SHOW_SECOND_HEADER,
    payload,
  };
}

export function deleteNotificationById(payload) {
  return {
    type: DELETE_NOTIFICATION_BY_ID,
    payload,
  };
}

export function updateNotification(payload) {
  return {
    type: UPDATE_NOTIFICATION_BY_ID,
    payload,
  };
}

export function updateNotificationOld(payload) {
  return {
    type: UPDATE_NOTIFICATION_OLD,
    payload,
  };
}
