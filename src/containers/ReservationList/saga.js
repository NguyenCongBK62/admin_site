import { put, call, takeLatest } from "redux-saga/effects";
import {
  FETCH_ALL_BY_DAY_WITH_PAGING,
  FETCH_BY_NAME_OR_SPELLING_OR_PHONE,
} from "constant";
import { setAllByDayWithPaging } from "actions/reservationListAction";
import { setLoading } from "actions/common";
import request from "utils/request";

function* fetchAllByDayWithPaging({ storeId, day, page }) {
  if (storeId > 0) {
    yield put(setLoading(true));
    const url = "/reservations/getAllByDayWithPaging";
    const option = {
      method: "GET",
      params: {
        storeId: storeId,
        day: day,
        page: page,
      },
    };

    try {
      const response = yield call(request, url, option, false);
      yield put(setLoading(false));
      yield put(setAllByDayWithPaging(response.data));
    } catch (e) {
      console.log(e);
      yield put(setLoading(false));
    }
  }
}

function* fetchByNameOrSpellingOrPhone({ storeId, searchText, page }) {
  if (storeId > 0) {
    yield put(setLoading(true));

    const url = "reservations/searchByNameOrSpellingOrPhone";
    const option = {
      method: "GET",
      params: {
        storeId: storeId,
        searchText: searchText,
        page: page,
      },
    };

    try {
      const response = yield call(request, url, option, false);
      yield put(setAllByDayWithPaging(response.data));
      yield put(setLoading(false));
    } catch (e) {
      console.log(e);
      yield put(setLoading(false));
    }
  }
}

export function* reservationListWatcher() {
  yield takeLatest(FETCH_ALL_BY_DAY_WITH_PAGING, fetchAllByDayWithPaging);
  yield takeLatest(
    FETCH_BY_NAME_OR_SPELLING_OR_PHONE,
    fetchByNameOrSpellingOrPhone
  );
}
