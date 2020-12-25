import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, Menu, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import Utils from "../../../../utils";

interface PerformanceCycle {
  onSelect: Function;
}

const Div = styled.div`
  .top {
    margin-top: 20px;
  }
`;

const PerformanceCycle: React.FC<PerformanceCycle> = props => {
  const { onSelect } = props;
  const state = useSelector((state: any) => state.INITIAL_DATA?.app_settings);

  const [cycles, setCycles] = useState<any>(state.settings?.cycles);
  useEffect(() => {
    let tempCycles = Utils.getPerformaceCycles(state.settings);
    setCycles(tempCycles);
    return () => {
      setCycles(undefined);
    };
  }, [state]);
  return (
    <Div>
      <Row className="top">
        <Col span={8}>
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                {cycles?.map((item: any, index: number) => (
                  <Menu.Item onClick={() => onSelect(item, index)} key={v4()}>
                    {item.name}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              Select Performance Cycles <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
        <Col span={8} />
      </Row>
    </Div>
  );
};

export default PerformanceCycle;
