import {
  SET_ALL_STORE_DETAIL_BY_ACCOUNT,
  FETCH_ALL_STORE_DETAIL_BY_ACCOUNT,
  RE_ORDERED_STORES,
  DELETE_STORE,
  GET_MAX_STORE,
  SET_MAX_STORE,
  FETCH_POSTAL_CODE_DATA,
  SET_POSTAL_CODE_DATA,
  GENERATE_UUID,
  SET_UUID,
  CREATE_STORE,
  IS_CREATED_STORE,
  FETCH_BY_ZIP_CODE,
  FETCH_STORE_BY_ID,
  SET_LOADED_STORE,
  EDIT_STORE,
} from "constant";

export function setAllStoreDetailByAccount(payload) {
  return {
    type: SET_ALL_STORE_DETAIL_BY_ACCOUNT,
    payload,
  };
}

export function getAllStoreDetailByAccount() {
  return {
    type: FETCH_ALL_STORE_DETAIL_BY_ACCOUNT,
  };
}

export function reOrderStores(reOrderedData) {
  return {
    type: RE_ORDERED_STORES,
    reOrderedData,
  };
}

export function deleteStore(storeId) {
  return {
    type: DELETE_STORE,
    storeId,
  };
}

export function setMaxStore(maxStore) {
  return {
    type: SET_MAX_STORE,
    maxStore,
  };
}

export function getMaxStore(numLoadStore) {
  return {
    type: GET_MAX_STORE,
    numLoadStore,
  };
}

export function setPostalCodeData(postalCodeData) {
  return {
    type: SET_POSTAL_CODE_DATA,
    postalCodeData,
  };
}

export function fetchPostalCodeData(code) {
  return {
    type: FETCH_POSTAL_CODE_DATA,
    code,
  };
}

export function generateUUID() {
  return { type: GENERATE_UUID };
}

export function setUUID(UUID) {
  return { type: SET_UUID, UUID };
}

export function createStore(data) {
  return {
    type: CREATE_STORE,
    data,
  };
}

export function editStore(data) {
  return {
    type: EDIT_STORE,
    data,
  };
}

export function isCreatedStore(payload) {
  return {
    type: IS_CREATED_STORE,
    payload,
  };
}

export function fetchByZipCode(data, id) {
  return {
    type: FETCH_BY_ZIP_CODE,
    data,
    id,
  };
}

export function fetchStoreById(id) {
  return {
    type: FETCH_STORE_BY_ID,
    id,
  };
}

export function setLoadedStore(payload) {
  return {
    type: SET_LOADED_STORE,
    payload,
  };
}
