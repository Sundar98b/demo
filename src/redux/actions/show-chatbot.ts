import { SHOW_CHATBOX } from "../types/action";

export const showChatBot = (val: boolean = true) => {
  return {
    type: SHOW_CHATBOX,
    payload: val,
  };
};
