import produce from "immer";
import { SET_IS_CREATED_ITEMS, SET_LOADED_ITEMS_DETAILS } from "constant";

const initialState = {
  isCreatedItems: false,
  loadeditemDetails: null,
};

const customItemCreateUpdateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_IS_CREATED_ITEMS:
        draft.isCreatedItems = action.payload;
        break;
      case SET_LOADED_ITEMS_DETAILS:
        draft.loadeditemDetails = action.payload;
        break;
      default:
        break;
    }
  });

export default customItemCreateUpdateReducer;
