import produce from "immer";
import { SET_IS_CREATED_TABLE, SET_LOADED_TABLE_DETAILS } from "constant";

const initialState = {
  isCreatedTable: false,
  loadedTableDetails: null,
};

const tableMasterCreateUpdateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_IS_CREATED_TABLE:
        draft.isCreatedTable = action.payload;
        break;
      case SET_LOADED_TABLE_DETAILS:
        draft.loadedTableDetails = action.payload;
        break;
      default:
        break;
    }
  });

export default tableMasterCreateUpdateReducer;
