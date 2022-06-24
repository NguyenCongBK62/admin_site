import produce from "immer";
import {
  SET_NET_CREATED,
  SET_STORE_DETAILS,
  SET_HOLIDAYS,
  SET_TABLE_AVAILABLE_TIME,
} from "constant";

const initialState = {
  created: false,
  store: {},
  availableTables: [],
  holidays: [],
};

const netReservationReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_NET_CREATED:
        draft.created = action.payload;
        break;
      case SET_STORE_DETAILS:
        draft.store = action.payload;
        break;
      case SET_HOLIDAYS:
        draft.holidays = action.payload;
        break;
      case SET_TABLE_AVAILABLE_TIME:
        draft.availableTables = action.payload;
        break;
      default:
        break;
    }
  });

export default netReservationReducer;
