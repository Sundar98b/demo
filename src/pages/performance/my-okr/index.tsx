import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Col, Radio, Row } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Approve from "../approve";
import CheckIn from "../checkin";
import MyOkrList from "./my-okr-list";
import MyTeam from "../my-team";
import Rolecheck from "../../../components/role-check";
import Utils from "../../../utils";
import { HasPermission } from "../../../components/topbar/menu";

const { xs } = Utils.MediaQuery;

const Div = styled.div`
  //border: 1px solid black;
  height: 2px;
  float: right;
  ${xs} {
    height: 30px;
    float: none;
  }
  .ant-radio-group {
    font-weight: 600;
  }
  .ant-radio-wrapper {
    margin-right: 0px;
    top: -32px;
    ${xs} {
      top: 0px;
    }
  }
  .ant-btn-primary {
    top: -32px;
    ${xs} {
      top: 0px;
    }
  }
`;

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

const TopButton = styled(Button)`
  color: #ffffff;
  background: #850746;
  width: 100%;
  :hover {
    color: #ffffff;
    background: #850746;
    font-style: italic;
  }
  :active {
    color: #ffffff;
    background: #850746;
  }
  :focus {
    color: #ffffff;
    background: #850746;
  }
`;

const ObjWButton = styled(Button)`
  color: #ffffff;
  background: #850746;
  :hover {
    color: #ffffff;
    background: #850746;
    font-style: italic;
  }
  :active {
    color: #ffffff;
    background: #850746;
  }
  :focus {
    color: #ffffff;
    background: #850746;
  }
`;

const Rdio = styled(Radio)`
  float: right;
  position: relative;
  top: -28px;
  right: 30px;
  ${xs} {
    position: absolute;
    top: 9px;
    right: 14px;
    float: none;
  }
`;

const Btn = styled(Button)`
  float: right;
  position: relative;
  top: -28px;
  ${xs} {
    position: absolute;
    top: 9px;
    right: 14px;
    float: none;
  }
`;

const OKR = (props: any) => {
  const location = useLocation();
  const history = useHistory();

  const [needReload, setneedReload] = useState(false);
  const [isExpand, setisExpand] = useState(false);
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [DrawerVisisble, setDrawerVisisble] = useState<any>(false);
  const [CurrentTab, setCurrentTab] = useState<any>("okr");
  const [CurrentBtnText, setCurrentBtnText] = useState<any>("okr");
  const [CurrentCycle, setCurrentCycle] = useState<any>();
  const [CurrentTimeline, setCurrentTimeline] = useState<any>("");

  useEffect(() => {
    setCurrentTab("my-okrs");
    setCurrentBtnText("my-okrs");
  }, []);

  useEffect(() => {
    if (location.search.includes("reload")) {
      setneedReload(true);
    }
  }, [location]);

  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    setCurrentTimeline(filter.performance_cycle);
    setisExpand(state.isExpand);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const buttonText = (value: string) => {
    switch (value) {
      case "my-okrs":
        return "OKR";
      case "checkin":
        return "Checkin";
      case "Approval":
        return "Approval";
      default:
        return "Checkin";
    }
  };

  const onClickCheckinBtnToggle = () => {
    if (CurrentTab === "my-okrs") {
      if (CurrentBtnText === "checkin") {
        setCurrentBtnText("my-okrs");
      } else {
        setCurrentBtnText("checkin");
      }
    } else if (CurrentTab === "my-team") {
      if (CurrentBtnText === "Approval") {
        setCurrentBtnText("my-okrs");
      } else {
        setCurrentBtnText("Approval");
      }
    }
  };

  useEffect(() => {
    onClickCheckinBtnToggle();
  }, [CurrentTab]);

  const toggleDrawer = () => {
    setDrawerVisisble(!DrawerVisisble);
  };

  const onRadioChange = (e: any) => {
    setCurrentTab(e.target.value);
    onClickCheckinBtnToggle();
    //history.push("/performance/" + e.target.value.toLowerCase());
  };

  const EnabledModule = state?.product_settings?.settings;
  const roles = state?.roles?.role;
  const _HasPermission = (key: any) => {
    return HasPermission(key, roles, EnabledModule, state);
  };

  return (
    <>
      <Div>
        {!props.embed && (
          <>
            <Rolecheck module="Objective" action="create">
              <Button type="primary" onClick={toggleDrawer} size="small">
                New
              </Button>
            </Rolecheck>
            &nbsp;
            {state?.user?.is_manager && (
              <Radio.Group onChange={onRadioChange} value={CurrentTab}>
                <Radio value={"my-okrs"}>My View</Radio>
                <Radio value={"my-team"}>My Team</Radio>
              </Radio.Group>
            )}
          </>
        )}
      </Div>
      <div style={{ height: "2px" }}></div>
      {/* <TopDiv>
        <Row>
          <Col span={2} style={{ textAlign: "center", paddingTop: "5px" }}>
            <strong>{CurrentTimeline}</strong>
          </Col>
          <Col span={17}></Col>

          <Col span={3}>
            {_HasPermission("Performance Management") &&
              CurrentBtnText === "checkin" && (
                <ObjWButton
                //onClick={onClickCheckinBtnToggle}
                >
                  {"Obj Weightage"}
                </ObjWButton>
              )}
          </Col>
          <Col span={2}>
            <TopButton onClick={onClickCheckinBtnToggle}>
              {buttonText(CurrentBtnText)}
            </TopButton>
          </Col>
        </Row>
      </TopDiv> */}
      {CurrentTab === "my-okrs" && (
        <MyOkrList
          embed={true}
          cycle={CurrentTimeline}
          isMyTeam={true}
          //teamSwitch={CurrentTab}
          new={DrawerVisisble}
        />
      )}
      {CurrentTab === "my-team" && <MyTeam />}
      {/* {CurrentBtnText === "okr" && CurrentTab !== "my-team" && <CheckIn />}
      {CurrentBtnText === "okr" && CurrentTab === "my-team" && <Approve />} */}
    </>
  );
};

export default OKR;
