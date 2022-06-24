import produce from "immer";
import { SET_LOGIN, SET_ACCOUNT_PROFILE } from "constant";
import auth from "utils/auth";

const initialState = {
  login_info: {
    token: auth.getToken() || "",
    isLoading: false,
    errorMsg: "",
  },
  profile: {},
};

const loginReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOGIN:
        draft.login_info = action.payload;
        break;
      case SET_ACCOUNT_PROFILE:
        draft.profile = action.payload;
        break;
      default:
        break;
    }
  });

export default loginReducer;
