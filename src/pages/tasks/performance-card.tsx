import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { RightOutlined } from "@ant-design/icons";

interface CountCardProps {
  title: string;
  color: string;
  value: number;
  total: number;
  setStatus: any;
  status?: string;
}

const CardWrap = styled.div`
  .ant-card-body {
    padding: 0px;
    box-shadow: ${props => (props.isOnClick ? "2px 2px 2px gray" : "0")};
    height: 80px;
  }
`;

const PerformanceCard: React.FC<CountCardProps> = props => {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [css, setCss] = useState<boolean>(false);

  useEffect(() => {
    if (props.title === "Open") {
      setStatus("Open");
    } else if (props.title === "Completed") {
      setStatus("Completed");
    } else if (props.title === "Overdue") {
      setStatus("Overdue");
    } else if (props.title === "Total") {
      setStatus("Total");
    } else {
      setStatus(undefined);
    }
  }, [props]);

  useEffect(() => {
    if (props.status) {
      if (props.status === status) {
        setCss(true);
      } else {
        setCss(false);
      }
    }
    if (props.status === undefined && props.title === "Total") {
      setCss(true);
    }
  }, [props]);

  const onCardClick = () => {
    props.setStatus(status);
  };

  return (
    <>
      <CardWrap isOnClick={css}>
        <Card
          style={{
            width: "75%",
            position: "relative",
            left: "12%",
            height: "80px",
          }}
          onClick={onCardClick}
          hoverable
        >
          <Row style={{ marginTop: "10px" }}>
            <Col span={20} style={{ textAlign: "center" }}>
              <Row>
                <b
                  style={{
                    fontSize: "1.5em",
                    marginLeft: "20px",
                    color: `${props.color}`,
                  }}
                >
                  {props.value}
                </b>
              </Row>
              <Row>
                <span
                  style={{
                    fontSize: "1em",
                    marginLeft: "20px",
                    color: `${props.color}`,
                  }}
                >
                  {props.title}
                </span>
              </Row>
            </Col>
            <Col
              span={4}
              style={{
                fontSize: "0.8em",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <RightOutlined />
            </Col>
          </Row>
        </Card>
      </CardWrap>
    </>
  );
};

export default PerformanceCard;
