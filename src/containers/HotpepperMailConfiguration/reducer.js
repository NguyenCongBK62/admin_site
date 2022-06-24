import {
  SET_ALL_MAIL_STATUS,
  CREATE_HOTPEPPER_SUCCESS,
  RESET_CREATE_HOTPEPPER_SUCCESS,
} from "constant";
import produce from "immer";

const initialState = {
  hostMailConfigStatus: {},
  flagCreateSuccess: null,
};

const hotpepperConfirmMailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_MAIL_STATUS:
        draft.hostMailConfigStatus = action.payload;
        break;
      case CREATE_HOTPEPPER_SUCCESS:
        draft.flagCreateSuccess = true;
        break;
      case RESET_CREATE_HOTPEPPER_SUCCESS:
        draft.flagCreateSuccess = false;
        break;
      default:
        break;
    }
  });

export default hotpepperConfirmMailReducer;
