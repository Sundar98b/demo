import React from "react";

import Delete from "../delete";
import Edit from "../edit";
import Rolecheck from "../role-check";

interface Actions {
  row: any;
  onEdit: Function;
  onDelete: Function;
  module?: string;
}

const Actions: React.FC<Actions> = props => {
  return (
    <>
      <Rolecheck module={props.module || ""} action="edit">
        <Edit row={props.row} onEdit={props.onEdit} /> &nbsp;
      </Rolecheck>
      <Rolecheck module={props.module || ""} action="delete">
        <Delete row={props.row} onDelete={props.onDelete} />
      </Rolecheck>
    </>
  );
};

Actions.defaultProps = {
  module: "",
};

export default Actions;
