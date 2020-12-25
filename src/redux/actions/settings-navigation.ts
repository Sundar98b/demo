import { NAVIGATE_SETTINGS } from "../types/action";

export const Navigate = (val: string[]) => {
  return {
    type: NAVIGATE_SETTINGS,
    payload: ["Settings", ...val],
  };
};
