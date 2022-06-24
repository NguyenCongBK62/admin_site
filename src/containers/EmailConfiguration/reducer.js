import { SET_HOST_MAIL_CONFIG_TYPE, SET_ALL_MAIL_STATUS } from "constant";
import produce from "immer";

const initialState = {
  hostMailConfigType: "",
  hostMailConfigStatus: {},
};

const emailConfigReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_HOST_MAIL_CONFIG_TYPE:
        draft.hostMailConfigType = action.payload;
        break;
      case SET_ALL_MAIL_STATUS:
        draft.hostMailConfigStatus = action.payload;
        break;
      default:
        break;
    }
  });
export default emailConfigReducer;
