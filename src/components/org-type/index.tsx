import React from "react";
import styled from "styled-components";
import { Avatar, Tooltip } from "antd";

import CrossTeam from "../../assets/cross-team.svg";
import Org from "../../assets/org.svg";
import Team from "../../assets/team.svg";
import User from "../../assets/user2.svg";

interface ObjectiveType {
  type: "own" | "team" | "cross_team" | "org" | "user";
  name?: string;
  image?: string;
}

const Images: any = {
  team: Team,
  cross_team: CrossTeam,
  org: Org,
  own: User,
};
const Warpper = styled.span`
  cursor: pointer;
  .ant-avatar img {
    height: 18px;
    width: auto;
  }
`;

const ObjTypeMapper = (type: string) => {
  const types: any = {
    own: " My Objective",
    team: "My Team Objective",
    cross_team: "Cross Functional Team",
    org: "My Organization Objective",
  };
  return types[type] || "";
};
const ObjectiveTypeAvatar: React.FC<ObjectiveType> = props => {
  if (props.type === "user") {
    let letter = props?.name?.charAt(0);
    if (props.image) {
      return (
        <Tooltip title={props.name || ""}>
          <Avatar shape="circle" src={props.image} />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={props.name || ""}>
          <Avatar shape="circle" style={{ background: "#fd7f57" }}>
            {letter}
          </Avatar>
        </Tooltip>
      );
    }
  } else {
    return (
      <Warpper>
        <Tooltip title={ObjTypeMapper(props.type)}>
          <Avatar src={Images[props.type]} shape="square" size="small" />
        </Tooltip>
      </Warpper>
    );
  }
};

export default ObjectiveTypeAvatar;
