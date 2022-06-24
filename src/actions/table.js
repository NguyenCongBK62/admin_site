import {
  CREATE_TABLE,
  DELETE_TABLE,
  FETCH_ALL_TABLES_BY_ACCOUNT,
  FETCH_TABLE_DETAILS_BY_ID,
  RE_ORDERED_TABLES,
  SET_ALL_TABLES_BY_ACCOUNT,
  SET_IS_CREATED_TABLE,
  SET_LOADED_TABLE_DETAILS,
  UPDATE_TABLE,
} from "constant";

export function fetchAllTablesByAccount(payload) {
  return {
    type: FETCH_ALL_TABLES_BY_ACCOUNT,
    payload,
  };
}

export function setAllTablesLByAccount(payload) {
  return {
    type: SET_ALL_TABLES_BY_ACCOUNT,
    payload,
  };
}

export function reOrderTables(reOrderedData, storeId) {
  return {
    type: RE_ORDERED_TABLES,
    reOrderedData,
    storeId,
  };
}

export function deleteTable(tableId, storeId) {
  return {
    type: DELETE_TABLE,
    tableId,
    storeId,
  };
}

export function createTable(data) {
  return {
    type: CREATE_TABLE,
    data,
  };
}

export function setIsCreatedTable(payload) {
  return {
    type: SET_IS_CREATED_TABLE,
    payload,
  };
}

export function fetchTableDetailsById(id) {
  return {
    type: FETCH_TABLE_DETAILS_BY_ID,
    id,
  };
}

export function setLoadedTableDetails(payload) {
  return {
    type: SET_LOADED_TABLE_DETAILS,
    payload,
  };
}

export function updateTable(data) {
  return {
    type: UPDATE_TABLE,
    data,
  };
}
