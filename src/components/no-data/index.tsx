import React from "react";
import styled from "styled-components";

import server from "../../assets/server.svg";

const Wrapper = styled.div`
  background: #efeef1;
  height: ${props => (props.height ? props.height + "px" : "100%")};
  width: 100%;
  text-align: center;
  padding-top: 24px;
  position: relative;
  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img {
    height: 50px;
    position: relative;
    opacity: 0.6;
  }
  p {
    padding-top: 4px;
  }
`;

interface NoDataCardProps {
  height?: number;
}
const NoDataCard: React.FC<NoDataCardProps> = props => {
  return (
    <Wrapper {...props}>
      <div>
        <img src={server} alt="Server Error" />
        <p>No Data Available!</p>
      </div>
    </Wrapper>
  );
};
NoDataCard.defaultProps = {
  height: 100,
};

export default NoDataCard;
