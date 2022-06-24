import produce from "immer";
import { SET_CUSTOM_ITEMS } from "constant";

const initialState = {
  custom_items: null,
};

const customItemsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CUSTOM_ITEMS:
        draft.custom_items = action.payload;
        break;
      default:
        break;
    }
  });

export default customItemsReducer;
