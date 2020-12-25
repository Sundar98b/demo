import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-right: 20px;
  width: 102.5%;
  bottom: 0;
  position: absolute;
  border-top: 1px solid #dedede;
  background: #f7f7f7;
  padding-top: 11px;
  padding-bottom: 6px;
  text-align: right;
  left: -23px;
  padding: 10px;
  .ant-btn:not(:first-child) {
    margin-left: 14px;
  }
`;
const Data = styled.div`
  padding-right: 20px;
`;
const FormFooter: React.FC = props => {
  return (
    <Wrapper>
      <Data>{props.children}</Data>
    </Wrapper>
  );
};

export default FormFooter;
