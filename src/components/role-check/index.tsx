import React from "react";
import styled from "styled-components";
import { Button, Result } from "antd";
import { useDispatch, useSelector } from "react-redux";

import Utils from "../../utils";
import { toggleRoleNotifier } from "../../redux/actions/role";

interface Rolecheck {
  module: string;
  action?: string;
  hidden?: boolean;
  fullpage?: boolean;
  skipModule?: boolean;
}

const NoPermission = styled.span`
  cursor: not-allowed;
  span {
    pointer-events: none;
    * {
      opacity: 0.9;
    }
  }
`;

const Rolecheck: React.FC<Rolecheck> = props => {
  const dispatcher = useDispatch();

  let roleData: any = [];

  const store = useSelector((store: any) => store.INITIAL_DATA);

  const EnabledModules = store?.product_settings?.settings;

  const hasModuleEnabled = (props: any) => {
    try {
      return !!(EnabledModules[props?.module] || props?.module_skip);
    } catch (error) {
      return false;
    }
  };

  if (store?.roles) {
    roleData = store.roles;
  }

  let hasData: any = {
    module: "",
    view: "",
    create: "",
    edit: "",
    delete: "",
    close: "",
    checkin: "",
    module_skip: false,
  };
  const dataLen = roleData?.role?.length;
  for (let index = 0; index < dataLen; index++) {
    const item = roleData["role"][index];
    if (item.module === props.module) {
      hasData = item;
      break;
    }
  }
  const actions = props.action || "view";
  const togglemodal = () => {
    let module = props.module;
    if (actions !== "view") {
      module += " " + Utils.titleCase(actions);
    }
    dispatcher(
      toggleRoleNotifier({
        module: module,
        visible: true,
      }),
    );
  };

  const subTitle =
    roleData?.name !== "Org Admin"
      ? "Sorry, you don't have sufficient permission to access this page."
      : "Sorry, this module is not enabled, please contact datalligence team";
  const title =
    roleData?.name !== "Org Admin"
      ? "Insufficient permission"
      : "Module is not enabled";
  const ButtonText =
    roleData?.name !== "Org Admin"
      ? "Notify admin"
      : "Contact datalligence team";
  const status = roleData?.name !== "Org Admin" ? "403" : "404";
  const Conditions = {
    gotPermission: hasData[actions] === "allowed",
    isProductAdmin: roleData.name === "Product Admin",
    isModuleEnabled: hasModuleEnabled(hasData),
    isHidden: !!props.hidden,
    fullpage: !!props.fullpage,
  };
  return (
    /**
     * Condition
     *  If Got Permission
     *  or He is the product admin
     * or the module is not enabled
     */

    <>
      {(!Conditions.gotPermission || !Conditions.isModuleEnabled) &&
        !Conditions.isProductAdmin && (
          <>
            {Conditions.fullpage && !Conditions.isHidden && (
              <Result
                status={status}
                title={title}
                subTitle={subTitle}
                extra={<Button type="primary">{ButtonText}</Button>}
              />
            )}
            {!Conditions.isHidden && !Conditions.fullpage && (
              <NoPermission
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglemodal();
                }}
              >
                <span> {props.children}</span>
              </NoPermission>
            )}
          </>
        )}
      {((Conditions.isModuleEnabled && Conditions.gotPermission) ||
        roleData.name === "Product Admin") && <> {props.children}</>}
    </>
  );
};
Rolecheck.defaultProps = {
  action: "view",
  hidden: false,
  skipModule: true,
};
export default Rolecheck;
