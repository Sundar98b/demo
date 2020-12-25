import { TOPBAR_NAVIGATE } from "../types/action";

export const NavigateTopBar = (keys: string) => {
  return {
    type: TOPBAR_NAVIGATE,
    payload: keys,
  };
};
