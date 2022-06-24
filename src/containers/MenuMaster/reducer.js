import produce from "immer";
import { SET_ALL_MENU_LIST } from "constant";

const initialState = {
  menuList: null,
};

const menuMasterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_MENU_LIST:
        draft.menuList = action.payload;
        break;
      default:
        break;
    }
  });

export default menuMasterReducer;
