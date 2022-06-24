import produce from "immer";
import { SET_ALL_ACCOUNT_LIST } from "constant";

const initialState = {
  accountList: {
    data: null,
    isLoading: true,
  },
};

const accountMasterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_ACCOUNT_LIST:
        draft.accountList = action.payload;
        break;
      default:
        break;
    }
  });

export default accountMasterReducer;
