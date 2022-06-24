import {
  SET_ALL_STAFF_STORES,
  RE_ORDERED_STAFF_STORES,
  DELETE_STAFF_STORE,
  FETCH_ALL_STAFF_STORES_BY_STORE_ID,
  CREATE_STAFF_STORE,
  UPDATE_STAFF_STORE,
  SET_LOADED_STAFF_STORE_DETAILS,
  FETCH_STAFF_STORE_DETAILS_BY_ID,
  SET_IS_CREATED_STAFF_STORE,
} from "constant";

export function fetchAllstaffStoresByStoreId(storeId) {
  return {
    type: FETCH_ALL_STAFF_STORES_BY_STORE_ID,
    storeId,
  };
}

export function setAllstaffStores(data, isLoading) {
  return {
    type: SET_ALL_STAFF_STORES,
    payload: {
      data,
      isLoading,
    },
  };
}

export function reOrderstaffStores(reOrderedData, storeId) {
  return {
    type: RE_ORDERED_STAFF_STORES,
    reOrderedData,
    storeId,
  };
}

export function deleteStaffStore(staffId, storeId) {
  return {
    type: DELETE_STAFF_STORE,
    staffId,
    storeId,
  };
}

export function createStaffStore(data) {
  return {
    type: CREATE_STAFF_STORE,
    data,
  };
}

export function updateStaffStore(data) {
  return {
    type: UPDATE_STAFF_STORE,
    data,
  };
}

export function setIsCreatedStaffStore(payload) {
  return {
    type: SET_IS_CREATED_STAFF_STORE,
    payload,
  };
}

export function fetchStaffStoreDetailsById(id) {
  return {
    type: FETCH_STAFF_STORE_DETAILS_BY_ID,
    id,
  };
}

export function setLoadedStaffStoreDetails(payload) {
  return {
    type: SET_LOADED_STAFF_STORE_DETAILS,
    payload,
  };
}
