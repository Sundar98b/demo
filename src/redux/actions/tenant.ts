import { SET_TENANT } from "../types/action";

export const SetTenant = (val: object = {}) => {
  return {
    type: SET_TENANT,
    payload: val,
  };
};
