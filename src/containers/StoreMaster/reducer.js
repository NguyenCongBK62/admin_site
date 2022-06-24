import produce from "immer";
import { SET_ALL_STORE_DETAIL_BY_ACCOUNT, SET_MAX_STORE } from "constant";

const initialState = {
  storeList: null,
  maxStore: false,
};

const storeMasterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_STORE_DETAIL_BY_ACCOUNT:
        draft.storeList = action.payload;
        break;
      case SET_MAX_STORE:
        draft.maxStore = action.maxStore;
        break;
      default:
        break;
    }
  });

export default storeMasterReducer;
