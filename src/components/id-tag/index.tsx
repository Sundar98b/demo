import React from "react";
import styled from "styled-components";

const Tags = styled.span`
  text-transform: uppercase;
  height: 25px;
  width: 30px;
  font-size: 1em;
  left: 0;
  color: #b0bec5;
  pointer-events: none;
  user-select: none;
  padding-right: 10px;
`;
const IdTag: React.FC = props => {
  return <Tags className="id-tag">{props.children}</Tags>;
};

export default IdTag;
