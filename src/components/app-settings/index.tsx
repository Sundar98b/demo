import React from "react";
import styled from "styled-components";
import { Result } from "antd";
import { useSelector } from "react-redux";
interface props {
  module: string;
  fullpage?: boolean;
}
const Warpper = styled.div`
  padding-top: 75px;
`;
const AppSettings: React.FC<props> = props => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const EnabledModule = state?.product_settings?.settings;
  let hasGo = false;

  if (EnabledModule && EnabledModule[props.module]) {
    hasGo = true;
  }
  return (
    <>
      {hasGo && props.children}
      {!hasGo && props.fullpage && (
        <Warpper>
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
          />
        </Warpper>
      )}
    </>
  );
};

AppSettings.defaultProps = {
  fullpage: false,
};

export default AppSettings;
