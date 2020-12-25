import { SHOW_ROLE_MODAL, actions } from "../types/action";

const InitState = {
  name: "",
  visible: false,
};
const RoleNotifier = (state = InitState, action: actions) => {
  switch (action.type) {
    case SHOW_ROLE_MODAL:
      return action.payload;
    default:
      return { ...state };
  }
};

export default RoleNotifier;
