import styled from "styled-components";
import useMedia from "use-media";
import React, { memo, useEffect, useState } from "react";
import { Avatar, Badge, Modal, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Chatbot from "../../assets/Chatbot.svg";
import Discussion from "../../assets/Discussion.svg";
import Logout from "../../assets/Logout.svg";
import Rolecheck from "../role-check";
import Settings from "../../assets/Settings.svg";
import Task from "../../assets/Task-list.svg";
import Utils from "../../utils";
import logoImg from "../../assets/logo-full.png";
import { showChatBot } from "../../redux/actions/show-chatbot";

const { md, xs } = Utils.MediaQuery;

const Warpper = styled.div`
  width: 78px;
  height: CALC(100vh - 47px);
  text-align: center;
  float: left;
  margin-top: 26px;
  /* z-index: 1000; */
  overflow: hidden;
  position: fixed;
  left: -4px;
  ${Utils.MediaQuery.xs} {
    width: 100%;
    height: 47px;
    position: fixed;
    text-align: center;
    bottom: 0;
    background: #fff;
    margin-top: 0;
    box-shadow: 0px -1px 1px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props =>
    props.active ? "rgba(175, 175, 175, 0.4)" : "transparent"};
  ${Utils.MediaQuery.xs} {
    display: inline-block;
    background: transparent;
  }

  a {
    min-height: 66px;
    padding: 16px 5px;
    ${Utils.MediaQuery.xs} {
      padding: 0;
    }
    img {
      width: 40px;
      height: auto;
      &.profile {
        border-radius: 50%;
        box-shadow: 0 3px 2px rgba(0, 0, 0, 0.3);
        max-height: 52px;
        object-fit: contain;
      }
      ${xs} {
        width: 35px;
        margin-left: 1.4em;
      }
    }
  }
`;
const IconContainer = styled.div`
  position: relative;
  top: 46%;
  transform: translateY(-50%);
  ${md} {
    transform: translate(-54%, -50%);
    left: 50%;
  }
`;

const PoweredBy = styled.div`
  height: 90px;
  width: 76px;
  font-size: 8px;
  position: fixed;
  bottom: -20px;
  left: 5px;
  a {
    color: #000;
  }
  img {
    margin: 0 auto;
    margin-top: 6px;
    max-width: 40px;
  }
  ${xs} {
    display: none;
  }
`;

const AvatarImg = styled(Avatar)`
  background-color: #fd7f57;
  font-weight: bolder;
  max-width: 40px;
`;

const Sidebar: React.FC = () => {
  const tooltipPlacement = useMedia("(max-width: 767px)") ? "top" : "right";
  const isActive = useSelector((store: any) => store.SIDEBAR_NAVIGATION);
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const [MsgCount, setMsgCount] = useState(0);
  const messageCount = useSelector((store: any) => store.MESSAGE_COUNT);

  useEffect(() => {
    setMsgCount(messageCount);
  }, [messageCount]);

  const pic = state?.user?.profile_photo ? state.user.profile_photo : "";
  const AvatarName = state?.user?.display_name?.charAt(0);
  const dispacther = useDispatch();
  const [logoutModal, setlogoutModal] = useState(false);
  const toggleLogoutModal = () => {
    setlogoutModal(!logoutModal);
  };

  const doLogout = () => {
    window.sessionStorage.removeItem("x-token");
    window.location.href = "/login";
  };

  return (
    <>
      <Warpper>
        <Modal
          title="Logout"
          centered
          visible={logoutModal}
          onOk={doLogout}
          onCancel={toggleLogoutModal}
          wrapClassName="logout-modal"
        >
          <p>Are you sure to Logout</p>
        </Modal>

        <IconContainer>
          <Rolecheck module="User Profile">
            <Item active={isActive === "profile"}>
              <Link to="/profile">
                <Tooltip placement={tooltipPlacement} title="Profile">
                  <>
                    {pic && <img src={pic} className="profile" alt="Profile" />}
                    {!pic && <AvatarImg size="large">{AvatarName}</AvatarImg>}
                  </>
                </Tooltip>
              </Link>
            </Item>
          </Rolecheck>
          {/* <Rolecheck module="Discussions">
            <Item active={isActive === "discussion"}>
              <Link to="/discussion">
                <Tooltip placement={tooltipPlacement} title="Discussions">
                  <Badge count={MsgCount} offset={[-9, 0]}>
                    <img src={Discussion} alt="Discussion" />
                  </Badge>
                </Tooltip>
              </Link>
            </Item>
          </Rolecheck> */}
          <Rolecheck module="Tasks">
            <Item active={isActive === "tasks"}>
              <Link to="/tasks">
                <Tooltip placement={tooltipPlacement} title="Tasks">
                  <img src={Task} alt="Tasks" />
                </Tooltip>
              </Link>
            </Item>
          </Rolecheck>

          <Rolecheck module="Settings Menu">
            <Item active={isActive === "Settings"}>
              <Tooltip placement={tooltipPlacement} title="Settings">
                <Link to="/settings">
                  <img src={Settings} alt="Settings" />
                </Link>
              </Tooltip>
            </Item>
          </Rolecheck>
          <Rolecheck module="Chat Bot">
            <Item
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                dispacther(showChatBot());
              }}
            >
              <a href="#chatbot">
                <Tooltip placement={tooltipPlacement} title="Chatbot">
                  <img src={Chatbot} alt="Chatbot" />
                </Tooltip>
              </a>
            </Item>
          </Rolecheck>
          <Item
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLogoutModal();
            }}
          >
            <a href="#logout">
              <Tooltip placement={tooltipPlacement} title="Logout">
                <img src={Logout} alt="Logout" />
              </Tooltip>
            </a>
          </Item>
        </IconContainer>
      </Warpper>
      <PoweredBy>
        <a
          href="http://datalligence.ai/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Powered By
          <img alt="Powered By" src={logoImg} />
        </a>
      </PoweredBy>
    </>
  );
};

export default memo(Sidebar);
