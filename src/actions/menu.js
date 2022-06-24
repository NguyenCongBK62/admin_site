import {
  DELETE_MENU,
  CREATE_MENU,
  FETCH_ALL_MENU_LIST,
  RE_ORDERED_MENUS,
  SET_ALL_MENU_LIST,
  SET_CREATED_MENU,
  UPDATE_MENU,
  FETCH_MENU_DETAILS_BY_ID,
  SET_LOADED_MENU_DETAILS,
} from "constant";

export function fetchAllMenuList(storeId) {
  return {
    type: FETCH_ALL_MENU_LIST,
    storeId,
  };
}

export function setAllMenuList(payload) {
  return {
    type: SET_ALL_MENU_LIST,
    payload,
  };
}

export function reOrderMenus(reOrderedData, storeId) {
  return {
    type: RE_ORDERED_MENUS,
    reOrderedData,
    storeId,
  };
}

export function deleteMenu(menuId, storeId) {
  return {
    type: DELETE_MENU,
    menuId,
    storeId,
  };
}

export function createMenu(data) {
  return {
    type: CREATE_MENU,
    data,
  };
}

export function updateMenu(data) {
  return {
    type: UPDATE_MENU,
    data,
  };
}

export function setCreatedMenu(payload) {
  return {
    type: SET_CREATED_MENU,
    payload,
  };
}

export function fetchMenuDetailsById(id) {
  return {
    type: FETCH_MENU_DETAILS_BY_ID,
    id,
  };
}

export function setLoadedMenuDetails(payload) {
  return {
    type: SET_LOADED_MENU_DETAILS,
    payload,
  };
}
