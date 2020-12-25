import { CHANGE_FILTER, actions } from "../types/action";

const InitState = {
  users: [],
  department: [],
  performance_cycle: "",
};
const FilterReducer = (state = InitState, action: actions) => {
  switch (action.type) {
    case CHANGE_FILTER:
      return action.payload;
    default:
      return { ...state };
  }
};

export default FilterReducer;
