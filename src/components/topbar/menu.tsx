import React, { memo } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { useSelector } from "react-redux";

import Rolecheck from "../role-check";

const { SubMenu } = Menu;

interface MenuContentProps {
  selectedKeys: string;
  mode: "inline" | "horizontal";
}

export const HasPermission = (
  role: any,
  roles: any,
  EnabledModule: any,
  state: any, 
) => {
  let hasPermission = false;
  let hasModule = false;
  const rolesLen = roles?.length;

  for (let index = 0; index < rolesLen; index++) {
    const item = roles[index];
    let modules = [role];
    if (role === "Performance") {
      modules = ["Objective", "Goals", "Key Results"];
    }
    if (item["view"] === "allowed" && modules.includes(item["module"])) {
      hasPermission = true;
      EnabledModule["Performance"] = true;
    }
  }
  if (EnabledModule && EnabledModule[role]) {
    hasModule = true;
  }

  return (hasModule && hasPermission) || state?.roles?.name === "Product Admin";
};

const MenuContent: React.FC<MenuContentProps> = props => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const roles = state?.roles?.role;

  const EnabledModule = state?.product_settings?.settings;
  let hasGo = false;
  if (EnabledModule) {
    hasGo = true;
  }

  const { selectedKeys, mode } = props;

  const _HasPermission = (key: any) => {
    return HasPermission(key, roles, EnabledModule, state);
  };
  return (
    <>
      <Menu mode={mode} selectedKeys={[selectedKeys]}>
        <Menu.Item key="insights">
          <Link to="/">
            Insights <HomeOutlined />
          </Link>
        </Menu.Item>

        {_HasPermission("Performance") && (
          <Menu.Item key="performance">
            <Link to="/performance/my-okrs"> Performance</Link>
          </Menu.Item>
        )}

        {!_HasPermission("Performance") && (
          <Menu.Item key="performance" disabled>
            <Rolecheck module="Performance">Performance</Rolecheck>
          </Menu.Item>
        )}
        <Menu.Item key="cfr">
            <Link to="/cfr"> CFR</Link>
          </Menu.Item>
        {_HasPermission("Reports") && (
          <Menu.Item key="reports">
            <Link to="/reports">Reports</Link>
          </Menu.Item>
        )}
        {!_HasPermission("Reports") && (
          <Menu.Item key="Reports" disabled>
            <Rolecheck module="Reports">Reports</Rolecheck>
          </Menu.Item>
        )}
        {/* <Menu.Item key="help">
          <Link to="/help">Help</Link>
        </Menu.Item> */}
        <Menu.Item key="analytics" disabled>
          <Rolecheck module="Analytics">Analytics</Rolecheck>
        </Menu.Item>
        {/* <Menu.Item key="analytifeedbackcs" disabled>
          <Rolecheck module="Feedback">Feedback</Rolecheck>
        </Menu.Item> */}
      </Menu>
    </>
  );
};

export default memo(MenuContent);
