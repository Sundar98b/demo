import React from "react";
import styled from "styled-components";
import { Avatar } from "antd";
interface UserChip {
  img: string;
  name: string;
  style?: any;
}
const Wrapper = styled.div`
  overflow: hidden;
  display: inline-block;
  background: #eef1f3;
  padding: 0 12px;
  height: 25px;
  line-height: 25px;
  border-radius: 32px;
  font-size: 13px;
  color: #2f4249;
  text-overflow: ellipsis;
  white-space: nowrap;

  img,
  .ant-avatar {
    display: block;
    float: left;
    border-radius: 50%;
    text-align: center;
    color: white;
    margin: 0 8px 0 -12px;
    .ant-avatar-string {
      text-transform: uppercase !important;
    }
  }
`;

export const AvatarImg = styled(Avatar)`
  background-color: #fd7f57;
  font-weight: bolder;
  .ant-avatar-string {
    text-transform: uppercase !important;
  }
`;

const UserChip: React.FC<UserChip> = props => {
  if (!props.style) {
    props.style = {};
  }

  const AvatarName = props.name?.charAt(0)?.toUpperCase();

  return (
    // eslint-disable-next-line react/style-prop-object
    <Wrapper style={props.style} className="user-chip">
      {!props.img && <AvatarImg size="small">{AvatarName}</AvatarImg>}
      {props.img && (
        <img alt="Styled Component" src={props.img} height={25} width={25} />
      )}
      {props.name}
    </Wrapper>
  );
};
UserChip.defaultProps = {
  style: {},
};
export default UserChip;
