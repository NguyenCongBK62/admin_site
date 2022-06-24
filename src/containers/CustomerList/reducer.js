import produce from "immer";
import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER_DETAILS,
  SET_CUSTOMER_HISTORY,
} from "constant";

const initialState = {
  customers: [],
  totalItems: 0,
  totalPages: 0,
  customerDetails: {},
  customerHistory: {},
};

const customerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CUSTOMER_LIST:
        draft.customers = action.payload.result;
        draft.totalItems = action.payload.totalItems;
        draft.totalPages = action.payload.totalPages;
        break;
      case SET_CUSTOMER_DETAILS:
        draft.customerDetails = action.payload;
        break;
      case SET_CUSTOMER_HISTORY:
        draft.customerHistory = action.payload;
        break;
      default:
        break;
    }
  });

export default customerReducer;
