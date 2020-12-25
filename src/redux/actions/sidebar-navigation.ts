import { SIDEBAR_NAVIGATION } from "../types/action";

export const navigateSidebar = (val: string) => {
  return {
    type: SIDEBAR_NAVIGATION,
    payload: val,
  };
};
