import produce from "immer";
import { SET_IS_CREATED_ACCOUNT, SET_LOADED_ACCOUNT_DETAILS } from "constant";

const initialState = {
  isCreatedAccount: false,
  loadedAccountDetails: null,
};

const accountMasterCreateUpdateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_IS_CREATED_ACCOUNT:
        draft.isCreatedAccount = action.payload;
        break;
      case SET_LOADED_ACCOUNT_DETAILS:
        draft.loadedAccountDetails = action.payload;
        break;
      default:
        break;
    }
  });

export default accountMasterCreateUpdateReducer;
