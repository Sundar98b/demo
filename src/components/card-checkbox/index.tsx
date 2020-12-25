import styled from "styled-components";
import React, { Children, useEffect, useState } from "react";
import { Card, Col, Radio, Row } from "antd";

interface CardCheckbox {
  value: string;
  onChange: Function;
  height?: Number;
}
interface CardCheckboxItem {
  value: string;
  checked?: boolean;
}

const CardCheckboxItemCard = styled(Card)`
  height: ${props => (props.height ? props.height + "px" : "120px")};
  min-width: 280px;
  border-radius: 5px;
  cursor: pointer;
  margin: 3px;
`;
const CardItem = styled.div`
  .ant-radio-wrapper {
    position: absolute;
    right: 0;
    top: 0;
  }

  .ant-card-bordered {
    border: ${props => (props.checked ? "1px solid #1890ff" : "")};
    background: ${props =>
      props.checked ? "rgba(244, 250, 255, 0.5294117647058824)" : "#fff"};
  }
`;

const CardCheckbox: React.FC<CardCheckbox> = props => {
  const [Active, setActive] = useState(props.value);
  useEffect(() => {
    setActive(props.value);
  }, [props]);
  return (
    <Row gutter={12}>
      {Children.map(props.children, (item: any) => (
        <Col>
          <CardItem
            onClick={() => {
              setActive(item.props.value);
              props.onChange(item.props.value);
            }}
            checked={Active === item.props.value}
          >
            <CardCheckboxItemCard height={props.height}>
              <Radio checked={Active === item.props.value} />
              {item}
            </CardCheckboxItemCard>
          </CardItem>
        </Col>
      ))}
    </Row>
  );
};
CardCheckbox.defaultProps = {
  height: 120,
};
export const CardCheckboxItem: React.FC<CardCheckboxItem> = props => {
  return <div {...props}>{props.children}</div>;
};

export default CardCheckbox;
