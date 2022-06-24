import produce from "immer";
import {
  SET_CUSTOMER_SUGGESTION,
  SET_TABLE_LIST,
  SET_MENU_LIST,
  SET_RECEPTIONIST,
  SET_RESERVATION_METHOD,
  SET_RESERVATION,
} from "constant";

const initialState = {
  tables: [],
  customerSuggestions: [],
  menus: [],
  receptionists: [],
  reservationMethods: [],
  created: false,
};

const createReservation = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CUSTOMER_SUGGESTION:
        draft.customerSuggestions = action.payload;
        break;
      case SET_TABLE_LIST:
        draft.tables = action.payload;
        break;
      case SET_MENU_LIST:
        draft.menus = action.payload;
        break;
      case SET_RECEPTIONIST:
        draft.receptionists = action.payload;
        break;
      case SET_RESERVATION_METHOD:
        draft.reservationMethods = action.payload;
        break;
      case SET_RESERVATION:
        draft.created = action.payload;
        break;
      default:
        break;
    }
  });

export default createReservation;
