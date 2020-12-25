import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import AdminTab from "./admin";
import AnnualGoals from "./annual-goals";
import MyOKR from "./my-okr/index";
import PRPage from "./performance-management";
import Rolecheck from "../../components/role-check";
import RootPage from "../root";
import Utils from "../../utils";
import { HasPermission } from "../../components/topbar/menu";
import { default as MyTree } from "./tree-view";

const { xs } = Utils.MediaQuery;

const Pane = Tabs.TabPane;

const Warpper = styled.div`
  height: 82vh;
  //border: 1px solid black;
  .ant-tabs {
    color: #000000;
  }
  .ant-tabs-ink-bar {
    border-bottom: 3px solid #381460;
  }
  .ant-tabs-tab {
    padding: 0 0 8px 0;
  }
  .ant-tabs-bar {
    margin: 0 0 2px 0;
    border-bottom: 1px solid #f0f0f0;
    // outline: none;
    // -webkit-transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    color: #381460;
    font-weight: 800;
    outline: none;
  }
`;

const TreeView = styled.div`
  background: #e0d9d9;
  margin-right: 9px;
  border-radius: 3px 3px 0 0;
  border: none;
  display: inline-block;
  height: 40px;
  margin: 0;
  margin-right: 2px;
  padding: 0 16px;
  line-height: 38px;
  position: absolute;
  right: 10px;
  z-index: 100;
  cursor: pointer;
  &::after {
    content: "";
    display: table;
    clear: both;
  }
  &.active {
    height: 40px;
    color: #3f4040;
    background: #f5f0f0;
    border-bottom: none;
  }
  ${xs} {
    display: none;
  }
`;
const tokens: any = {
  goals: v4(),
  checkin: v4(),
  "my-okrs": v4(),
  "my-team": v4(),
  approvals: v4(),
};
const Performance: React.FC = () => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const [CurrentTab, setCurrentTab] = useState("OkRs");
  const [isAdmin, setisAdmin] = useState(false);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    let admin =
      state?.roles?.name === "Product Admin" ||
      state?.roles?.name === "Org Admin"
        ? true
        : false;
    setisAdmin(admin);
  }, [state]);
  useEffect(() => {
    if (location.pathname.indexOf("performance/goals/new") !== -1) {
      setCurrentTab("goals");
    } else if (location.pathname.indexOf("performance/my-okrs/new") !== -1) {
      setCurrentTab("my-okrs");
    } else if (location.pathname.indexOf("performance/approvals") !== -1) {
      setCurrentTab("approvals");
    } else if (
      location.pathname.indexOf("performance/performance-management") !== -1
    ) {
      setCurrentTab("performance-management");
    } else {
      setCurrentTab(location.pathname.replace("/performance/", ""));
    }
  }, [location.pathname]);

  const OnTabChange = (tab: string) => {
    setCurrentTab(tab);
    history.push("/performance/" + tab.toLowerCase());
    if (tokens[tab]) {
      tokens[tab] = v4();
    }
  };
  const EnabledModule = state?.product_settings?.settings;

  const roles = state?.roles?.role;
  const _HasPermission = (key: any) => {
    return HasPermission(key, roles, EnabledModule, state);
  };

  return (
    <RootPage hideOverflow={true} topbar="performance">
      <Rolecheck module="Objective" fullpage>
        <Warpper>
          {/* {state?.user?.is_manager && (
            <TreeView
              className={CurrentTab === "tree-view" ? "active" : ""}
              onClick={() => OnTabChange("tree-view")}
            >
              Org View
            </TreeView>
          )} */}

          <Tabs
            //animated ={{inkBar: true, tabPane: true}}
            //tabBarStyle={{color: "#rf3456"}}
            activeKey={CurrentTab}
            onChange={OnTabChange}
          >
            {_HasPermission("Goals") && (
              <Pane key="goals" tab="Goals">
                <AnnualGoals key={tokens["goals"]} />
              </Pane>
            )}
            {/* <Pane key="checkin" tab="My Checkins">
              <CheckIn key={tokens["checkin"]} />
            </Pane> */}
            <Pane key="my-okrs" tab="OKR">
              <Rolecheck module="Objective" fullpage>
                <MyOKR key={tokens["my-okrs"]} />
              </Rolecheck>
            </Pane>
            {isAdmin && (
              <Pane key="admin" tab="Master View">
                <AdminTab key={tokens["admin-tab"]} />
              </Pane>
            )}
            {state?.product_settings?.settings["Competence"] && (
              <Pane key="Competence" tab="Competence" disabled>
                {/* <AnnualGoals key={tokens["goals"]} /> */}
              </Pane>
            )}
            {state?.product_settings?.settings["Performance Management"] && (
              <Pane key="performance-management" tab="Performance Review">
                <PRPage key={tokens["performance-management"]} />
              </Pane>
            )}
            {/* {state?.user?.is_manager && (
              <Pane key="my-team" tab="My Team">
                <MyTeam key={tokens["my-team"]} />
              </Pane>
            )} */}
            {/* {state?.user?.is_manager && (
              <Pane key="approvals" tab="My Approval">
                <Approve key={tokens.approvals} />
              </Pane>
            )} */}
            {state?.user?.is_manager && (
              <Pane key="tree-view" tab="Tree View">
                <MyTree key={tokens["tree-view"]} />
              </Pane>
            )}
          </Tabs>
        </Warpper>
      </Rolecheck>
    </RootPage>
  );
};

export default Performance;
