export interface actions {
  payload: any;
  type: string;
}

export const NAVIGATE_SETTINGS = "NAVIGATE_SETTINGS";
export const TOPBAR_NAVIGATE = "TOPBAR_NAVIGATE";
export const SIDEBAR_NAVIGATION = "SIDEBAR_NAVIGATION";
export const GET_INIIDATA = "GET_INITDATA";
export const SET_INITIAL_DATA = "SET_INITIAL_DATA";
export const SHOW_ROLE_MODAL = "SHOW_ROLE_MODAL";
export const GET_TENANT = "GET_TENANT";
export const SET_TENANT = "SET_TENANT";
export const SHOW_CHATBOX = "SHOW_CHATBOX";
export const CHANGE_FILTER = "CHANGE_FILTER";
export const SET_MESSAGE_COUNT = "SET_MESSAGE_COUNT";
