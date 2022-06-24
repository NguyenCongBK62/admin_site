import produce from "immer";
import {
  IS_CREATED_LINE_CONFIG,
  SET_LINE_BOT_INFO,
  SET_LINE_CONFIG_BY_STORE_ID,
  SET_WEBHOOK_INFO,
} from "constant";

const initialState = {
  lineConfigData: [],
  lineBotInfo: null,
  webhookInfo: null,
  isCreatedLineConfig: false,
};

const lineConfigReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LINE_CONFIG_BY_STORE_ID:
        draft.lineConfigData = action.data;
        break;
      case SET_LINE_BOT_INFO:
        draft.lineBotInfo = action.data;
        break;
      case SET_WEBHOOK_INFO:
        draft.webhookInfo = action.data;
        break;
      case IS_CREATED_LINE_CONFIG:
        draft.isCreatedLineConfig = action.payload;
        break;
      default:
        break;
    }
  });
export default lineConfigReducer;
