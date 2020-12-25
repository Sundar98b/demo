import { CHANGE_FILTER } from "../types/action";

export const changeFilters = (val: object = {}) => {
  return {
    type: CHANGE_FILTER,
    payload: val,
  };
};
