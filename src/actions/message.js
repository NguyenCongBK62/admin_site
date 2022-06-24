import { CREATE_MESSAGE } from "constant";

export function createMessage(payload) {
  return {
    type: CREATE_MESSAGE,
    payload,
  };
}
