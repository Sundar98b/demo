import { actions, SHOW_CHATBOX } from "../types/action";

const ShowChatBot = (state = false, action: actions) => {
  switch (action.type) {
    case SHOW_CHATBOX:
      return action.payload;
    default:
      return state;
  }
};

export default ShowChatBot;
