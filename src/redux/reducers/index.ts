import { combineReducers } from "redux";

import FilterReducer from "./filters";
import RoleNotifier from "./role";
import SettingsNavigation from "./settings-navigation";
import ShowChatBot from "./show-chatbox";
import TenantReducer from "./tentant";
import TopbarReducer from "./topbar-navigation";
import sidebarNavigation from "./sidebar-navigation";
import InitData, { MessageCount } from "./init";

const rootReducer = combineReducers({
  SETTINGS_NAVIGATION: SettingsNavigation,
  TOPBAR_STORE: TopbarReducer,
  SIDEBAR_NAVIGATION: sidebarNavigation,
  INITIAL_DATA: InitData,
  ROLE_STORE: RoleNotifier,
  TETANT: TenantReducer,
  SHOW_CHATBOX: ShowChatBot,
  FILTERS: FilterReducer,
  MESSAGE_COUNT: MessageCount,
});

export default rootReducer;
