import {
  FETCH_ALL_BY_DAY_WITH_PAGING,
  FETCH_BY_NAME_OR_SPELLING_OR_PHONE,
  SET_ALL_BY_DAY_WITH_PAGING,
  SET_BY_NAME_OR_SPELLING_OR_PHONE,
} from "constant";

export function fetchAllByDayWithPaging(storeId, day, page) {
  return {
    type: FETCH_ALL_BY_DAY_WITH_PAGING,
    storeId,
    day,
    page,
  };
}

export function setAllByDayWithPaging(payload) {
  return {
    type: SET_ALL_BY_DAY_WITH_PAGING,
    payload,
  };
}

export function fetchByNameOrSpellingOrPhone(storeId, searchText, page) {
  return {
    type: FETCH_BY_NAME_OR_SPELLING_OR_PHONE,
    storeId,
    searchText,
    page,
  };
}

export function setByNameOrSpellingOrPhone(payload) {
  return {
    type: SET_BY_NAME_OR_SPELLING_OR_PHONE,
    payload,
  };
}
