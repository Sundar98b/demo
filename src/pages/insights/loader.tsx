import React from "react";
import styled from "styled-components";

const LRD = styled.div`
  height: 100px;
  margin: 0;
`;
const Loader = () => {
  return <LRD className="skleton" />;
};
export default Loader;
