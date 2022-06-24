import produce from "immer";
import {
  SET_RESERVATION_DATA_DAY,
  SET_RESERVATION_DATA_WEEK,
  SET_RESERVATION_DATA_MONTH,
  SET_RESERVATION_DETAILS,
  SET_IS_DELETED,
  SET_CURRENT_GANTT_VIEW,
} from "constant";

const initialState = {
  dayResponse: { data: [] },
  weekResponse: { data: [] },
  monthResponse: { data: [] },
  reservation: {},
  isDelete: false,
  currentGanttView: "day",
};

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_RESERVATION_DATA_DAY:
        draft.dayResponse = action.payload;
        draft.weekResponse = { data: [] };
        draft.monthResponse = { data: [] };
        break;
      case SET_RESERVATION_DATA_WEEK:
        draft.weekResponse = action.payload;
        draft.dayResponse = { data: [] };
        draft.monthResponse = { data: [] };
        break;
      case SET_RESERVATION_DATA_MONTH:
        draft.monthResponse = action.payload;
        draft.weekResponse = { data: [] };
        draft.dayResponse = { data: [] };
        break;
      case SET_RESERVATION_DETAILS:
        draft.reservation = action.payload;
        break;
      case SET_IS_DELETED:
        draft.isDelete = action.payload;
        break;
      case SET_CURRENT_GANTT_VIEW:
        draft.currentGanttView = action.payload;
        break;
      default:
        break;
    }
  });
export default homeReducer;
