import React from "react";
import styled from "styled-components";

import Bullet from "../../components/bullet";

const BulletSection = styled.div`
  &:hover {
    background: #fffefe;
  }
  > div {
    position: relative;
    height: 53px;
    top: -16px;
  }
`;
interface Props {
  data: any;
}

const Title = styled.h3`
  margin-top: 16px;
  padding-bottom: 15px;
  text-align: center;
`;

export default function GoalChart(props: Props) {
  return (
    <BulletSection>
      <Title>Annual Goals</Title>
      {props.data?.map((item: any, index: number) => (
        <Bullet title={item.title} progress={item.data} key={index} />
      ))}
    </BulletSection>
  );
}
