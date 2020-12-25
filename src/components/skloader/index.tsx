import React from "react";
import styled from "styled-components";
import { Skeleton } from "antd";

const Wrapper = styled.div`
  background: #ffffff;
`;
interface SKLoader {
  count?: number;
}

const SKLoader: React.FC<SKLoader> = ({ count }) => {
  return (
    <Wrapper>
      {[...Array(count)].map((x, i) => (
        <Skeleton active avatar key={i} />
      ))}
    </Wrapper>
  );
};

SKLoader.defaultProps = {
  count: 3,
};
export default SKLoader;
