import { put, call, takeLatest } from "redux-saga/effects";
import {
  DELETE_TABLE,
  FETCH_ALL_TABLES_BY_ACCOUNT,
  RE_ORDERED_TABLES,
} from "constant";
import request from "utils/request";
import {
  setAllTablesLByAccount,
  fetchAllTablesByAccount as fetchAllTablesByAccountAction,
  setIsCreatedTable,
} from "actions/table";
import { setError, setLoading, setSuccessMessage } from "actions/common";

function* fetchAllTablesByAccount({ payload }) {
  const storeId = payload;
  if (parseInt(storeId) > 0) {
    yield put(setLoading(true));
    const url = "tables/getAllTableByAccount";
    const options = {
      method: "GET",
      params: {
        storeId: parseInt(storeId),
      },
    };

    try {
      const response = yield call(request, url, options, false);
      yield put(setAllTablesLByAccount(response.data, false));
      yield put(setLoading(false));
    } catch (e) {
      yield put(setAllTablesLByAccount(null, false));
      yield put(setError(e.toString()));
      yield put(setLoading(false));
    }
  }
}

function* reOrderTables({ reOrderedData, storeId }) {
  yield put(setLoading(true));

  const url = "tables/changeOrder";
  const options = {
    method: "PUT",
    data: reOrderedData,
  };
  try {
    yield call(request, url, options, false);
    yield put(setLoading(false));
    yield put(setSuccessMessage("表示順序が正常に更新されました"));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(fetchAllTablesByAccountAction(storeId));
    yield put(setLoading(false));
  }
}

function* deleteTable({ tableId, storeId }) {
  yield put(setLoading(true));
  const url = "tables/delete/" + tableId;
  const options = {
    method: "DELETE",
  };
  try {
    yield call(request, url, options, false);
    yield put(fetchAllTablesByAccountAction(storeId));
    yield put(setLoading(false));
    yield put(setSuccessMessage("削除しました。"));
    yield put(setIsCreatedTable(true));
  } catch (e) {
    yield put(setError(e.toString()));
    yield put(setLoading(false));
    yield put(setIsCreatedTable(true));
  }
}

export function* tableMasterWatcher() {
  yield takeLatest(FETCH_ALL_TABLES_BY_ACCOUNT, fetchAllTablesByAccount);
  yield takeLatest(RE_ORDERED_TABLES, reOrderTables);
  yield takeLatest(DELETE_TABLE, deleteTable);
}
