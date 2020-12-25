import { actions, NAVIGATE_SETTINGS } from "../types/action";

const SettingsNavigation = (state = [], action: actions) => {
  switch (action.type) {
    case NAVIGATE_SETTINGS:
      return action.payload;
    default:
      return [...state];
  }
};

export default SettingsNavigation;
