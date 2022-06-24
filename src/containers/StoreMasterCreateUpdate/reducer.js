import produce from "immer";
import {
  IS_CREATED_STORE,
  SET_LOADED_STORE,
  SET_POSTAL_CODE_DATA,
  SET_UUID,
} from "constant";

const initialState = {
  postalCodeData: [],
  UUID: null,
  isCreatedStore: false,
  loadedStoreData: null,
};

const storeMasterCreateUpdateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_POSTAL_CODE_DATA:
        draft.postalCodeData = action.postalCodeData;
        break;
      case SET_UUID:
        draft.UUID = action.UUID;
        break;
      case IS_CREATED_STORE:
        draft.isCreatedStore = action.payload;
        break;
      case SET_LOADED_STORE:
        draft.loadedStoreData = action.payload;
        break;
      default:
        break;
    }
  });

export default storeMasterCreateUpdateReducer;
