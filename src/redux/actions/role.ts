import { SHOW_ROLE_MODAL } from "../types/action";

export const toggleRoleNotifier = (val: object = {}) => {
  return {
    type: SHOW_ROLE_MODAL,
    payload: val,
  };
};
