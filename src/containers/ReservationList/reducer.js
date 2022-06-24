import produce from "immer";
import {
  SET_ALL_BY_DAY_WITH_PAGING,
  SET_BY_NAME_OR_SPELLING_OR_PHONE,
} from "constant";

const initialState = {
  reservation_data: null,
  searchText_data: null,
};

const reservationListReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_BY_DAY_WITH_PAGING:
        draft.reservation_data = action.payload;
        break;
      case SET_BY_NAME_OR_SPELLING_OR_PHONE:
        draft.searchText_data = action.payload;
        break;
      default:
        break;
    }
  });

export default reservationListReducer;
