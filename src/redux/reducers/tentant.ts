import { GET_TENANT, actions, SET_TENANT } from "../types/action";

const InitState = {
  id: "",
};
const TenantReducer = (state = InitState, action: actions) => {
  switch (action.type) {
    case GET_TENANT:
      return action.payload;
    case SET_TENANT:
      return action.payload;
    default:
      return { ...state };
  }
};

export default TenantReducer;
