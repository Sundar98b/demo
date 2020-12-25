import { SET_INITIAL_DATA, SET_MESSAGE_COUNT, actions } from "../types/action";

const InitState = {
  organization: {},
  roles: {},
  app_settings: {},
  user: {},
  notifications: [],
  unread: 0,
  sidebar: false,
  isExpand: false,
};
const InitData = (state = InitState, action: actions) => {
  switch (action.type) {
    case SET_INITIAL_DATA:
      return action.payload;
    default:
      return { ...state };
  }
};

export const MessageCount = (state = 0, action: actions) => {
  switch (action.type) {
    case SET_MESSAGE_COUNT:
      return action.payload;
    default:
      return state;
  }
};

export default InitData;
