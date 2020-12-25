import styled from "styled-components";
import useMedia from "use-media";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Col, Popover, Row, Tooltip } from "antd";
import {
  BellOutlined,
  FilterOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";

import Filter from "../filters";
import LazyImage from "../lazy-img";
import MenuContent from "./menu";
import Notification from "../notification";
import QuickAdd from "../quick-add";
import Utils from "../../utils";
import logoImg from "../../assets/logo-full.png"; 
import { SetInitialData } from "../../redux/actions/init";

const { xs } = Utils.MediaQuery;
const Warpper = styled(Row)`
  //border: 1px solid black;
  background: #850746;
  height: 47px;
  line-height: 2.4;
  margin: 0;
  padding: 0px 5px;
  position: fixed;
  z-index: 1000;
  width: 100vw;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  ${xs} {
    padding-left: 12px;
  }
  .ant-menu {
    font-size: 18px;
  }
`;
const LogoCont = styled(Col)`
  //border: 1px solid black;
  background: #ffffff;
  float: left;
  //width: 180px;
  height: 42px;
  top: 2px;
  left: -2px;
  img {
    max-height: 40px;
    max-width: 100%;
    display: inherit;
    //margin-top: -5px;
  }
  ${xs} {
    width: 60%;
  }
`;
const MenuContainer = styled(Col)`
  //border: 1px solid black;
  float: left;
  padding-left: 12px;
  padding-top: 7px;
  .ant-menu {
    font-size: 18px;
    background: #850746;
  }
  .ant-menu-horizontal {
    .ant-menu-item {
      a {
        color: #ffffff;
        :hover {
          color: #ffffff;
          font-style: italic;
        }
      }
    }
    .ant-menu-item-selected {
      a {
        color: #ffffff;
        border-bottom: 2px solid white;
      }
      ::after {
        border-bottom: 0px;
        color: #f2f2f2;
      }
    }
    .ant-menu-item-disabled {
      color: #000000 !important;
    }
  }
  ${xs} {
    display: none;
    left: -100vw;
    transition: 1s;

    &.open {
      display: block;
      position: fixed;
      width: 96vw;
      background: #fff;
      top: 48px;
      height: 86vh;
      overflow-y: auto;
      text-overflow: ellipsis;
      animation: slide 0.5s forwards;
    }
  }
`;
const IconContainer = styled(Col)`
  //border: 1px solid black;
  color: #ffffff;
  width: 3%;
  float: left;
  text-align: right;
  //padding-right: 12px;
  cursor: pointer;
  padding-top: 7px;
  ${xs} {
    width: 8.5%;
  }
`;
const HamburgerMenu = styled(Col)`
  //border: 1px solid black;
  display: none;
  ${xs} {
    display: block;
    width: 5%;
    float: left;
    cursor: pointer;
    color: #ffffff;
  }
`;

const Topbar: React.FC = (props: any) => {
  const [Count, setCount] = useState(0);
  const [QuickAddVisible, setQuickAddVisible] = useState(false);
  const mode = useMedia("(max-width: 767px)") ? "inline" : "horizontal";
  const [isOpen, setOpen] = useState(false);
  const selectedKeys = useSelector((store: any) => store.TOPBAR_STORE);
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const [RefreshToken, setRefreshToken] = useState(v4());
  const logo = state?.organization?.logo ? state.organization.logo : logoImg;
  const dispatcher = useDispatch();
  const toggleQuickAdd = useCallback(() => {
    setQuickAddVisible(!QuickAddVisible);
  }, [QuickAddVisible]);
  useEffect(() => {
    if (state.unread) {
      setCount(state.unread);
    }
  }, [state]);

  useEffect(() => {
    if (mode === "horizontal") {
      setOpen(false);
    }
  }, [mode]);

  const ToggleMenu = useCallback(() => {
    state.sidebar = !state.sidebar;
    dispatcher(SetInitialData(state));
    setOpen(!isOpen);
  }, [dispatcher, isOpen, state]);

  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return useMemo(() => {
    return (
      <Warpper className="topbar" justify="space-around">
        <HamburgerMenu onClick={() => ToggleMenu()}>
          <MenuOutlined />
        </HamburgerMenu>
        <LogoCont span={2}>
          <LazyImage alt="Logo" src={logo} />
        </LogoCont>
        <MenuContainer className={isOpen ? "open" : ""} span={18}>
          <MenuContent selectedKeys={selectedKeys} mode={mode} />
        </MenuContainer>
        <Popover
          overlayClassName="quick-tooltip"
          placement="bottomRight"
          trigger="click"
          content={<Filter user_id={state?.user?.id || ""} />}
        >
          <IconContainer span={1}>
            <FilterOutlined style={{ fontSize: 20 }} />
          </IconContainer>
        </Popover>

        <Popover
          visible={QuickAddVisible}
          onVisibleChange={() => setQuickAddVisible(!QuickAddVisible)}
          overlayClassName="quick-tooltip"
          placement="bottomRight"
          trigger="click"
          content={<QuickAdd togglePopover={toggleQuickAdd} />}
        >
          <IconContainer span={1}>
            <PlusCircleOutlined style={{ fontSize: 20 }} />
          </IconContainer>
        </Popover>
        <Popover
          overlayClassName="notification-tooltip"
          placement="bottomRight"
          trigger="click"
          content={<Notification refreshToken={RefreshToken} />}
          title="Notification"
          onVisibleChange={visible => {
            if (visible) {
              setRefreshToken(v4());
            }
          }}
        >
          <IconContainer span={1}>
            <Badge count={Count}>
              <BellOutlined style={{ fontSize: 20 }} />
            </Badge>
          </IconContainer>
        </Popover>
        <Tooltip title="help">
          <IconContainer span={1}>
            <Link to="/help" className="remove-link-decoration">
              <QuestionOutlined style={{ fontSize: 20 }} />
            </Link>
          </IconContainer>
        </Tooltip>
      </Warpper>
    );
  }, [
    logo,
    isOpen,
    selectedKeys,
    mode,
    state,
    QuickAddVisible,
    toggleQuickAdd,
    RefreshToken,
    Count,
    ToggleMenu,
  ]);
};

export default memo(Topbar);
