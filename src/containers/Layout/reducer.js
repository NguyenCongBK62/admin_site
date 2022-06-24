import produce from "immer";
import {
  SET_NOTIFY_MESSAGE_PAGING,
  TOGGLE_COLLAPSE,
  TOGGLE_BACKDROP,
  SET_SELECTED_STORE,
  SET_STORES,
  SET_NOTIFICATIONS,
  SET_RESERVATION_COLUMN,
  SET_RESERVATION_DATA,
  SET_ERROR,
  SET_SUCCESS_MESSAGE,
  SET_LOADING,
  SET_CUSTOMER_CUSTOM_ITEM_ORDER,
  SET_CUSTOM_ITEM_ORDER,
  SET_NET_RESERVATION_UNCONFIRMED_BY_STOREID,
  SET_IPHONE,
  SET_UUID,
  SET_SHOW_SECOND_HEADER,
} from "constant";
import auth from "utils/auth";

const initialState = {
  notifications: {
    lstMessageNotify: [],
    totalNewMsg: 0,
  },
  collapsed: false,
  backdrop: false,
  loading: false,
  stores: [],
  reservationColumns: [],
  reservationData: [],
  selectedStore: {
    id:
      auth.getKey("loginUser.storeId") !== null
        ? auth.getKey("loginUser.storeId")
        : 0,
    name: "",
  },
  storeUUID: "",
  customerCustomOrder: {},
  customOrder: [],
  error: "",
  successMessage: "",
  netReservationUncofirmed: [],
  isIphone: false,
  showSecondHeader: false,
};

const layoutReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_NOTIFY_MESSAGE_PAGING:
        draft.notifications = action.payload;
        break;
      case TOGGLE_COLLAPSE:
        draft.collapsed = !draft.collapsed;
        break;
      case TOGGLE_BACKDROP:
        draft.backdrop =
          action.payload === null ? !draft.backdrop : action.payload;
        break;
      case SET_SELECTED_STORE:
        draft.selectedStore = action.payload;
        auth.setKey("loginUser.storeId", action.payload.id);
        break;
      case SET_STORES:
        draft.stores = action.payload;
        break;
      case SET_NOTIFICATIONS:
        draft.notifications = action.payload;
        break;
      case SET_RESERVATION_COLUMN:
        draft.reservationColumns = action.payload;
        break;
      case SET_RESERVATION_DATA:
        draft.reservationData = action.payload;
        break;
      case SET_ERROR:
        draft.error = action.payload;
        break;
      case SET_SUCCESS_MESSAGE:
        draft.successMessage = action.payload;
        break;
      case SET_LOADING:
        draft.loading = action.payload;
        break;
      case SET_CUSTOMER_CUSTOM_ITEM_ORDER:
        draft.customerCustomOrder = action.payload;
        break;
      case SET_CUSTOM_ITEM_ORDER:
        draft.customOrder = action.payload;
        break;
      case SET_NET_RESERVATION_UNCONFIRMED_BY_STOREID:
        draft.netReservationUncofirmed = action.payload;
        break;
      case SET_IPHONE:
        draft.isIphone = action.payload;
        break;
      case SET_UUID:
        draft.storeUUID = action.payload;
        break;
      case SET_SHOW_SECOND_HEADER:
        draft.showSecondHeader = action.payload;
        break;
      default:
        break;
    }
  });

export default layoutReducer;
