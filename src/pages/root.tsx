import styled from "styled-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatBot from "./chat-bot";
import ContentCard from "../components/contnet-card";
import Utils from "../utils";
import { NavigateTopBar } from "../redux/actions/topar-navigaton";
import { SetInitialData } from "../redux/actions/init";
import { changeFilters } from "../redux/actions/filters";
import { navigateSidebar } from "../redux/actions/sidebar-navigation";

const { xs } = Utils.MediaQuery;

const ContWrapper = styled.div`
  width: 100%;
  height: CALC(100vh - 49px);
  text-align: center;
  float: left;
  margin-top: 47px;
  padding-left: 67px;
  overflow: hidden;

  ${xs} {
    width: 100%;
    height: CALC(100vh - 90px);
    margin-bottom: 47px;
    padding-left: 0px;
    padding: 2px;
  }
`;
type RootPageProps = {
  bg?: boolean;
  sidebar?: string;
  topbar?: string;
  hideOverflow?: boolean;
  color?: string;
};

const RootPage: React.FC<RootPageProps> = props => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const filters = useSelector((store: any) => store.FILTERS);

  useEffect(() => {
    document.querySelector("#app-loader")?.remove();
  }, []);

  useEffect(() => {
    const perfCycle = state?.app_settings?.settings?.current_cycle;
    if (!filters.performance_cycle) {
      dispatcher(
        changeFilters({
          users: [],
          department: [],
          performance_cycle: perfCycle,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const dispatcher = useDispatch();
  useEffect(() => {
    if (props.sidebar) {
      dispatcher(navigateSidebar(props.sidebar));
    }
    if (props.topbar) {
      dispatcher(NavigateTopBar(props.topbar));
    }
    state.sidebar = false;
    dispatcher(SetInitialData(state));
    return () => {
      dispatcher(navigateSidebar(""));
      dispatcher(NavigateTopBar(""));
    };
  }, [dispatcher, props.sidebar, props.topbar, state]);

  const { bg } = Object.assign({ bg: true }, props);
  return (
    <div>
      <ChatBot />
      <ContWrapper>
        {bg && (
          <>
            <ContentCard color={props.color} hideOverfow={props.hideOverflow}>
              {props.children}
            </ContentCard>
          </>
        )}
        {!bg && props.children}
      </ContWrapper>
      <div className="clearfix" />
    </div>
  );
};

export default RootPage;
