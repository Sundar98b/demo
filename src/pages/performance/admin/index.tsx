import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Col, Empty, Row, message } from "antd";
import { useSelector } from "react-redux";

import MyOkrList from "../my-okr/my-okr-list";
import Select2 from "../../../components/select2";

const TopDiv = styled.div`
  border: 1px solid #850746;
  margin: 0 4px 2px 4px;
  padding: 2px;
  border-radius: 8px;
  .ant-row {
    //border: 1px solid green;
  }
  .ant-col {
    //border: 1px solid red;
  }
`;

const Card = styled.div`
  padding: 5px;
  background: #fff;
`;
const EmptyWrapper = styled.div`
  padding-top: 8em;
`;
const ObjWrapper = styled.div`
  overflow-y: auto;
  height: 100%;
`;
const AdminTab: React.FC = () => {
  const [CurrentTimeline, setCurrentTimeline] = useState<any>("");
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [UserID, setUserID] = useState();
  const [isSearchLoading, setisSearchLoading] = useState(false);
  const [IsSearch, setIsSearch] = useState(false);
  useEffect(() => {
    setCurrentTimeline(filter.performance_cycle);
  }, [state]);

  const DoSearch = () => {
    if (!UserID) {
      return message.error("Please Select User");
    }
    setIsSearch(true);
  };
  return (
    <div>
      <TopDiv>
        <Row justify="space-between" align="bottom">
          <Col span={2} style={{ textAlign: "center" }}>
            <strong>{CurrentTimeline}</strong>
          </Col>
          <Col span={15}>
            {/* <Form.Item label="Performance Cycle">
              <Select
                value={CurrentCycle}
                onChange={(val: any) => {
                  setCurrentCycle(val);
                  setIsSearch(false);
                }}
                style={{ width: "200px" }}
              >
                {state?.app_settings?.settings?.cycles?.map((item: any) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
          </Col>
          <Col span={5} style={{ textAlign: "right" }}>
            <Select2
              placeholder={"Select User"}
              value={UserID}
              onChange={(value: any) => {
                setUserID(value);
                setIsSearch(false);
              }}
              entity="users"
              style={{ width: "200px" }}
            />
          </Col>
          <Col span={2} style={{ textAlign: "right" }}>
            <Button type="primary" loading={isSearchLoading} onClick={DoSearch}>
              Search
            </Button>
          </Col>
        </Row>
      </TopDiv>
      <>
        {!IsSearch && !UserID && (
          <EmptyWrapper>
            <Empty description="Please Select User" />
          </EmptyWrapper>
        )}
        {IsSearch && UserID && (
          <ObjWrapper>
            <MyOkrList
              onLoad={() => {
                setisSearchLoading(false);
              }}
              embed={true}
              id={UserID}
              cycle={CurrentTimeline}
              isMyTeamPage={true}
            />
          </ObjWrapper>
        )}
      </>
    </div>
  );
};

export default AdminTab;
