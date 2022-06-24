import {
  CREATE_RESERVED_ROUTE,
  DELETE_RESERVED_ROUTE,
  FETCH_ALL_RESERVED_ROUTE_BY_STORE_ID,
  FETCH_RESERVED_ROUTE_DETAILS_BY_ID,
  RE_ORDERED_RESERVED_ROUTE,
  SET_ALL_RESERVED_ROUTE,
  SET_IS_CREATED_RESERVED_ROUTE,
  SET_RESERVED_ROUTE_DETAILS,
  UPDATE_RESERVED_ROUTE,
} from "constant";

export function fetchAllReservedRouteByStoreId(storeId) {
  return {
    type: FETCH_ALL_RESERVED_ROUTE_BY_STORE_ID,
    storeId,
  };
}

export function setAllReservedRoute(payload) {
  return {
    type: SET_ALL_RESERVED_ROUTE,
    payload,
  };
}

export function reOrderReservedRoute(reOrderedData, storeId) {
  return {
    type: RE_ORDERED_RESERVED_ROUTE,
    reOrderedData,
    storeId,
  };
}

export function deleteReservedRoute(ReservedRouteId, storeId) {
  return {
    type: DELETE_RESERVED_ROUTE,
    ReservedRouteId,
    storeId,
  };
}

export function createReservedRoute(data) {
  return {
    type: CREATE_RESERVED_ROUTE,
    data,
  };
}

export function setIsCreatedReservedRoute(payload) {
  return {
    type: SET_IS_CREATED_RESERVED_ROUTE,
    payload,
  };
}

export function fetchReservedRouteDetailsById(id) {
  return {
    type: FETCH_RESERVED_ROUTE_DETAILS_BY_ID,
    id,
  };
}

export function setReservedRouteDetails(payload) {
  return {
    type: SET_RESERVED_ROUTE_DETAILS,
    payload,
  };
}

export function updateReservedRoute(data) {
  return {
    type: UPDATE_RESERVED_ROUTE,
    data,
  };
}
