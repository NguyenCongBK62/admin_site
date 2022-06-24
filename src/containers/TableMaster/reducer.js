import produce from "immer";
import { SET_ALL_TABLES_BY_ACCOUNT } from "constant";

const initialState = {
  tables: null,
};

const tableMasterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_TABLES_BY_ACCOUNT:
        draft.tables = action.payload;
        break;
      default:
        break;
    }
  });

export default tableMasterReducer;
