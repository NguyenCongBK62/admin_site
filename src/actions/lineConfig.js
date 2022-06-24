import {
  CREATE_LINE_CONFIG,
  DELETE_LINE_CONFIG,
  FETCH_LINE_BOT_INFO,
  FETCH_LINE_CONFIG_BY_STORE_ID,
  FETCH_WEBHOOK_INFO,
  IS_CREATED_LINE_CONFIG,
  SET_LINE_BOT_INFO,
  SET_LINE_CONFIG_BY_STORE_ID,
  SET_WEBHOOK_INFO,
} from "constant";

export function createLineConfig(data) {
  return {
    type: CREATE_LINE_CONFIG,
    data,
  };
}

export function setIsCreatedLineConfig(payload) {
  return {
    type: IS_CREATED_LINE_CONFIG,
    payload,
  };
}

export function fetchLineConfigByStoreId(storeId) {
  return {
    type: FETCH_LINE_CONFIG_BY_STORE_ID,
    storeId,
  };
}

export function setLineConfigByStoreId(data) {
  return {
    type: SET_LINE_CONFIG_BY_STORE_ID,
    data,
  };
}

export function fetchLineBotInfo(accessToken) {
  return {
    type: FETCH_LINE_BOT_INFO,
    accessToken,
  };
}

export function setLineBotInfo(data) {
  return {
    type: SET_LINE_BOT_INFO,
    data,
  };
}

export function fetchWebhookInfo(accessToken) {
  return {
    type: FETCH_WEBHOOK_INFO,
    accessToken,
  };
}

export function setWebhookInfo(data) {
  return {
    type: SET_WEBHOOK_INFO,
    data,
  };
}

export function deleteLineConfig(id, storeId) {
  return {
    type: DELETE_LINE_CONFIG,
    id,
    storeId,
  };
}
