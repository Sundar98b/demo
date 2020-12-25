import { SET_INITIAL_DATA, SET_MESSAGE_COUNT } from "../types/action";

export const SetInitialData = (val: object = {}) => {
  return {
    type: SET_INITIAL_DATA,
    payload: val,
  };
};

export const SetMessageCount = (val: any) => {
  return {
    type: SET_MESSAGE_COUNT,
    payload: val,
  };
};
