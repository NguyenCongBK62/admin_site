import produce from "immer";
import { SET_ALL_STAFF_STORES } from "constant";

const initialState = {
  staffStores: {
    data: null,
    isLoading: true,
  },
};

const staffStoreMasterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_STAFF_STORES:
        draft.staffStores = action.payload;
        break;
      default:
        break;
    }
  });

export default staffStoreMasterReducer;
