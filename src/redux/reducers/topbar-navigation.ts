import { actions, TOPBAR_NAVIGATE } from "../types/action";

const TopbarReducer = (state = "", action: actions) => {
  switch (action.type) {
    case TOPBAR_NAVIGATE:
      return action.payload;
    default:
      return state;
  }
};

export default TopbarReducer;
