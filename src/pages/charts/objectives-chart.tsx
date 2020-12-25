import React from "react";
import styled from "styled-components";

import Bullet from "../../components/bullet";

const BulletSection = styled.div`
  > div {
    position: relative;
    height: 53px;
    top: -16px;
  }
`;

const Title = styled.h3`
  margin-top: 16px;
  padding-bottom: 15px;
  text-align: center;
`;
interface BulletChartData {
  measures: number[];
  targets: number[];
}
interface BulletChartDataProps {
  title: string;
  data: BulletChartData[];
}
interface Props {
  data: any;
}
export default function ObjectivesChart(props: Props) {
  return (
    <BulletSection>
      <Title>Objectives Progress</Title>
      {props.data?.map((item: any, index: number) => (
        <Bullet title={item.title} progress={item.data} key={index} />
      ))}
    </BulletSection>
  );
}
