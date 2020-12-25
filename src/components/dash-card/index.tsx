import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  background: #fff;
  padding: 6px;
  font-weight: 500;
  color: #757880;
  margin: 5px;
  border: 1px solid #ebeaea;
  text-align: center;
  h4,
  h3 {
    cursor: default;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    font-family: Roboto;
    font-size: 16px;
    color: rgb(117, 117, 117);
  }
`;
const DashCard: React.FC = props => {
  return <Wrapper> {props.children} </Wrapper>;
};

export default DashCard;
