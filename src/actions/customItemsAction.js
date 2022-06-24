import {
  CREATE_CUSTOM_ITEMS,
  DELETE_CUSTOM_ITEM,
  FETCH_CUSTOM_ITEMS,
  FETCH_CUSTOM_ITEMS_DETAILS,
  RE_ORDERED_CUSTOM_ITEMS,
  SET_CUSTOM_ITEMS,
  SET_IS_CREATED_ITEMS,
  SET_LOADED_ITEMS_DETAILS,
  UPDATE_CUSTOM_ITEMS,
  RE_ORDERED_CUSTOMER_CUSTOM_FIELD,
} from "constant";

export function fetchCustomItems(storeId) {
  return {
    type: FETCH_CUSTOM_ITEMS,
    storeId,
  };
}

export function setCustomItems(payload) {
  return {
    type: SET_CUSTOM_ITEMS,
    payload,
  };
}

export function deleteCustomItem(customItemId, storeId) {
  return {
    type: DELETE_CUSTOM_ITEM,
    customItemId,
    storeId,
  };
}

export function reOrderCustomItems(reOrderedData, storeId) {
  return {
    type: RE_ORDERED_CUSTOM_ITEMS,
    reOrderedData,
    storeId,
  };
}

export function reOrderCustomerCustomField(reOrderedData, storeId) {
  return {
    type: RE_ORDERED_CUSTOMER_CUSTOM_FIELD,
    reOrderedData,
    storeId,
  };
}

export function createCustomItems(data) {
  return {
    type: CREATE_CUSTOM_ITEMS,
    data,
  };
}

export function setIsCreatedItems(payload) {
  return {
    type: SET_IS_CREATED_ITEMS,
    payload,
  };
}

export function updateCustomItems(data) {
  return {
    type: UPDATE_CUSTOM_ITEMS,
    data,
  };
}

export function fetchCustomItemsDetails(id) {
  return {
    type: FETCH_CUSTOM_ITEMS_DETAILS,
    id,
  };
}

export function setLoadedItemsDetails(payload) {
  return {
    type: SET_LOADED_ITEMS_DETAILS,
    payload,
  };
}
