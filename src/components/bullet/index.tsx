import styled from "styled-components";
import React, { ReactNode } from "react";
import { Col, Row } from "antd";

import Utils from "../../utils";

interface Bullet {
  title: ReactNode;
  progress: number;
  prefix?: boolean;
  span?: number;
}
const BulletWrapper = styled.div`
  width: 98%;
  padding: 4px;
  .title {
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-bottom: 8px;
    font-size: 11px;
    padding-top: 3px;
  }
  .placeholder {
    position: relative;
    background: #f4f4f4;
    height: 25px;
    width: 100%;
    border-radius: 3px;
    /* &:before {
       content: "0";
       float: right;
       font-size: 12px;
       color: grey;
       position: absolute;
       left: 0;
       top: -12px;
     }
     &:after {
       content: "100";
       float: right;
       font-size: 12px;
       color: grey;
       position: absolute;
       right: 0;
       top: -12px;
     } */
    .chart {
      width: 90%;
      background: #6394f8;
      height: 25px;
      position: relative;
      border-radius: 3px;

      &:after {
        content: attr(data-progress);
        float: right;
        font-size: 13px;
        position: absolute;
        right: 4px;
        top: 3px;
      }
      .progress {
        display: inline-block;
        position: relative;
      }
    }
  }
`;
const BulletChartSection = styled.div`
  width: 90%;
  background: linear-gradient(
    90deg,
    rgba(5, 160, 188, 1) 0%,
    rgba(97, 236, 220, 1) 100%
  );
  height: 25px;
  position: relative;
  border-radius: 3px;
  &::before {
    content: attr(data-progress);
    float: right;
    font-size: 13px;
    position: absolute;
    right: 5px;
    top: 3px;
    color: #ececec;
    font-weight: bold;
  }
  &.zero::before {
    left: 2px;
    color: #505050 !important;
  }
  .progress {
    display: inline-block;
    position: relative;
  }
`;
const Bullet: React.FC<Bullet> = ({ title, progress, prefix, span }) => {
  if (!span) {
    span = 0;
  }
  let className = progress > 1 ? "" : "zero";
  className += " pg-" + Utils.redAmberGreen(Math.round(progress));
  return (
    <BulletWrapper>
      <Row>
        {prefix && <Col span={span}>{title}</Col>}
        <Col span={prefix ? 24 - span : 24}>
          {!prefix && <div className="title">{title}</div>}
          <div className="placeholder">
            <BulletChartSection
              className={className}
              percentage={Utils.round(progress as any)}
              style={{
                width: progress > 100 ? 100 + "%" : progress + "% ",
              }}
              data-progress={Math.round(progress as any) + "% "}
            ></BulletChartSection>
          </div>
        </Col>
      </Row>
    </BulletWrapper>
  );
};
Bullet.defaultProps = {
  span: 0,
} as Partial<Bullet>;
export default Bullet;
