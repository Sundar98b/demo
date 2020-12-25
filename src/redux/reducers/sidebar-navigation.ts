import { actions, SIDEBAR_NAVIGATION } from "../types/action";

const sidebarNavigation = (state = "", action: actions) => {
  if (action.type === SIDEBAR_NAVIGATION) {
    return action.payload;
  } else {
    return state;
  }
};
export default sidebarNavigation;
