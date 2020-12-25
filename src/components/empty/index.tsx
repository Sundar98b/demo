import React from "react";
import styled from "styled-components";
import { Empty } from "antd";
interface EmptyImg {
  description: string | React.ReactNode;
}

const EmptyWrapper = styled.div`
  height: 100%;
  background: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyImg: React.FC<EmptyImg> = props => {
  return (
    <EmptyWrapper>
      <Empty description={props.description} />
    </EmptyWrapper>
  );
};
export default EmptyImg;
