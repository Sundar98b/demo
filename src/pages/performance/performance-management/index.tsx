import styled from "styled-components";
import React, { lazy, useEffect, useState } from "react";
import { Radio } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Utils from "../../../utils";
import retry from "../../../utils/retry";

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

const MyTeamPR = lazy(() => retry(() => import("./my-team")));
const MyPR = lazy(() => retry(() => import("./my-view")));

const PRPage = (props: any) => {
  const location = useLocation();
  const history = useHistory();
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [CurrentTab, setCurrentTab] = useState<any>("");

  useEffect(() => {
    let tab: any = "my-pr";
    setCurrentTab(tab);
    history.push("/performance/performance-management/" + tab.toLowerCase());
  }, []);

  const onRadioChange = (e: any) => {
    const tab: any = e.target.value;
    setCurrentTab(tab);
    history.push("/performance/performance-management/" + tab.toLowerCase());
  };

  return (
    <>
      <Div>
        {!props.embed && (
          <>
            {state?.user?.is_manager && (
              <Radio.Group onChange={onRadioChange} value={CurrentTab}>
                <Radio value={"my-pr"}>My View</Radio>
                <Radio value={"my-team-pr"}>My Team</Radio>
              </Radio.Group>
            )}
          </>
        )}
      </Div>
      <div style={{ height: "2px" }}></div>
      {CurrentTab === "my-pr" && <MyPR />}
      {CurrentTab === "my-team-pr" && <MyTeamPR />}
    </>
  );
};

export default PRPage;
