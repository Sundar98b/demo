interface krActionsProps {
  type: string;
  user: string;
  item: any;
  isAdmin: boolean;
}
const krActions = ({ type, user, item, isAdmin }: krActionsProps): string => {
  let { kr_status, obj_status, user_id } = item;
  switch (type) {
    case "edit":
      if (user_id === user || isAdmin) {
        return "";
      } else {
        return "hide";
      }
    case "delete":
      if (user_id === user || isAdmin) {
        return "";
      } else {
        return "hide";
      }
    case "duplicate":
      if (user_id === user || isAdmin) {
        return "";
      } else {
        return "hide";
      }
    case "checkin":
      if (user_id === user || isAdmin) {
        return "";
      } else {
        return "hide";
      }

    default:
      return "hide";
  }
};

export default krActions;
