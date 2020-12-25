interface objActionProps {
  type: string;
  user: string;
  item: any;
  isAdmin: boolean;
}
const objActions = ({ type, user, item, isAdmin }: objActionProps): string => {
  let { status, kr_weightage, user_id, line_manager } = item;

  switch (type) {
    case "submit_for_approval":
      if (status === "yet_to_submit" && parseInt(kr_weightage, 10) === 100) {
        return "";
      } else {
        return "hide";
      }
    case "approve":
      if (
        status === "awaiting_for_approval" &&
        (line_manager === user_id || isAdmin)
      ) {
        return "";
      } else {
        return "hide";
      }
    case "reject":
      if (
        status === "awaiting_for_closure" &&
        (line_manager === user_id || isAdmin)
      ) {
        return "";
      } else {
        return "hide";
      }
    case "edit":
      if (
        ["yet_to_submit", "awaiting_for_approval", "rejected"].includes(
          status,
        ) &&
        (item.user_id === user || isAdmin)
      ) {
        return "";
      } else {
        return "hide";
      }
    case "delete":
      if (
        ["yet_to_submit", "awaiting_for_approval", "rejected"].includes(
          status,
        ) &&
        (item.user_id === user || isAdmin)
      ) {
        return "";
      } else {
        return "hide";
      }
    case "add-kr":
      if (status !== "closed") {
        return "";
      } else {
        return "hide";
      }
    case "edit-kr-weightage":
      if (
        (status !== "closed" || status !== "awaiting_for_approval") &&
        (user_id === user || isAdmin)
      ) {
        return "";
      } else {
        return "hide";
      }
    case "duplicate":
      return "";
    case "submit_for_closure":
      if (
        parseInt(item.non_completed_kr, 10) === 0 &&
        (user === user_id || isAdmin)
      ) {
        return "";
      } else {
        return "hide";
      }
    case "close":
      if (
        status === "awaiting_for_closure" &&
        (line_manager === user_id || isAdmin)
      ) {
        return "";
      } else {
        return "hide";
      }
    case "request_to_reopen":
      if (status === "closed" && (user === user_id || isAdmin)) {
        return "";
      } else {
        return "hide";
      }

    case "reopen":
      if (status === "closed" && (user === line_manager || isAdmin)) {
        return "";
      } else {
        return "hide";
      }

    default:
      return "hide";
  }
};

export default objActions;
