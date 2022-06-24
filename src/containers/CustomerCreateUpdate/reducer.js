import produce from "immer";
import { SET_CUSTOMER_STATUS, SET_CUSTOMER_FORM } from "constant";

const initialState = {
  customerDetails: {},
  status: [],
  created: false,
};

const customerCreateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CUSTOMER_STATUS:
        draft.status = action.payload;
        break;
      case SET_CUSTOMER_FORM:
        draft.created = action.payload;
        break;
      default:
        break;
    }
  });

export default customerCreateReducer;
