import produce from "immer";
import { SET_CREATED_MENU, SET_LOADED_MENU_DETAILS } from "constant";

const initialState = {
  isCreatedMenu: false,
  loadedMenuDetails: null,
};

const menuMasterCreateUpdateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CREATED_MENU:
        draft.isCreatedMenu = action.payload;
        break;
      case SET_LOADED_MENU_DETAILS:
        draft.loadedMenuDetails = action.payload;
        break;
      default:
        break;
    }
  });

export default menuMasterCreateUpdateReducer;
