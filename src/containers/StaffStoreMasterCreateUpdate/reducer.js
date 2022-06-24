import produce from "immer";
import {
  SET_IS_CREATED_STAFF_STORE,
  SET_LOADED_STAFF_STORE_DETAILS,
} from "constant";

const initialState = {
  isCreatedStaffStore: false,
  loadedStaffStoreDetails: null,
};

const staffStoreCreateUpdateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_IS_CREATED_STAFF_STORE:
        draft.isCreatedStaffStore = action.payload;
        break;
      case SET_LOADED_STAFF_STORE_DETAILS:
        draft.loadedStaffStoreDetails = action.payload;
        break;
      default:
        break;
    }
  });

export default staffStoreCreateUpdateReducer;
