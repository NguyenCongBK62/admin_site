import produce from "immer";
import { SET_ALL_RESERVED_ROUTE } from "constant";

const initialState = {
  reservedRouteData: null,
};

const reservedRouteMasterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_RESERVED_ROUTE:
        draft.reservedRouteData = action.payload;
        break;
      default:
        break;
    }
  });

export default reservedRouteMasterReducer;
