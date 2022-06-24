import produce from "immer";
import {
  SET_IS_CREATED_RESERVED_ROUTE,
  SET_RESERVED_ROUTE_DETAILS,
} from "constant";

const initialState = {
  isCreatedReservedRoute: false,
  loadedReservedRouteDetails: null,
};

const reservedRouteMasterCreateUpdateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_IS_CREATED_RESERVED_ROUTE:
        draft.isCreatedReservedRoute = action.payload;
        break;
      case SET_RESERVED_ROUTE_DETAILS:
        draft.loadedReservedRouteDetails = action.payload;
        break;
      default:
        break;
    }
  });

export default reservedRouteMasterCreateUpdateReducer;
