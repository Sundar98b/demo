import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Drawer,
  Dropdown,
  Empty,
  Menu,
  Modal,
  Progress,
  Result,
  Row,
  Tooltip,
  message,
  notification,
} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  ReconciliationOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";

import Discussion from "../../../../assets/Discussion.svg";
import HttpService from "../../../../services/httpService";
import KRModifiers from "../modifiers/kr-modifiers";
import ObjectiveTypeAvatar from "../../../../components/org-type";
import Rolecheck from "../../../../components/role-check";
import SKLoader from "../../../../components/skloader";
import SUBKR from "../subkr";
import Status from "../../../../components/status";
import Utils from "../../../../utils";
import krActions from "./kr-actions";

//import { Link } from "react-router-dom";

//import { showChatBot } from "../../redux/actions/show-chatbot";

const { confirm } = Modal;

interface KR {
  refreshToken: string;
  objective_id: string;
  count: number;
  expand: boolean;
  is_admin: boolean;
  isMyTeamPage?: boolean;
}

const redAmberGreen = (str: number) => {
  if (str >= 0 && str <= 39) {
    return "red";
  } else if (str >= 40 && str <= 69) {
    return "#ffa726";
  } else if (str >= 70) {
    return "#43a047";
  }
};

const KeyResultsWrap = styled.div`
  margin-top: -2px;
  padding-left: 21px;
  padding-top: 20px;
  .ant-timeline-item:last-child {
    padding-bottom: 0;
  }
  overflow: hidden;
`;
const CardWrap = styled.div`
  //border: 1px solid black;
  //padding: 5px;

  // .ant-timeline-item {
  //   position: relative;
  //   margin: 0;
  //   //padding-top: 5px;
  //   font-size: 14px;
  //   list-style: none;
  //  // border-bottom: 1px dashed #e6e6e6;
  // }

  // .ant-timeline-item-content {
  //   position: initial;
  //   //margin: 0 0 0 5px;
  //   word-break: break-word;
  // }
  // .ant-timeline-item-head {
  //   //top: 1rem;
  // }
  // .ant-timeline-item-tail {
  //   //top: 1.5rem;
  //   height: calc(100%);
  // }
  // .ant-timeline-item-last {
  //   border-bottom: 0px;
  //   .ant-timeline-item-content {
  //     min-height: 0px;
  //   }
  // }

  .timeline {
    //border: 1px solid black;
    height: 100%;
  }
  .timeline-top {
    border: 1px solid #e5e5e5;
    height: 15%;
    width: 1px;
    margin: 0 50%;
  }
  .timeline-circle {
    border: 1px solid black;
    height: 0.7em;
    width: 0.7em;
    margin: 0 44%;
    border-radius: 100%;
  }
  .timeline-bottom {
    border: 1px solid #e5e5e5;
    height: 80%;
    width: 1px;
    margin: 0 50%;
  }
  .ant-row {
    //border: 1px solid red;
    //padding: 5px;
  }
  .ant-col {
    //border: 1px solid green;
    //padding: 0px 2px;
    overflow: hidden;
  }
  .WeightageTag {
    height: 20px;
    padding: 0 4px;
    font-size: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    opacity: 1;
  }
  .Krbadge {
    //padding: 0px 12px;
    color: #f1f1f1;
    border-radius: 14px;
    background: #7d2c9c;
    margin: 0;
    //display: inline;
    //margin-right: -12px;
    font-size: 12px;
    text-align: center;
    min-height: 10px;
    width: 4rem;
    font: status-bar;
  }

  .krDropdown {
    //border: 1px solid black;
    font-size: 26px;
  }

  .action {
    //font-size: x-large;
    // position: absolute;
    // right: -10px;
    // top: 1px;
  }
`;

const ProgressCss = styled.div`
  .ant-progress-line {
    //left: 15px;
  }
  .ant-progress-bg {
    height: 16px !important;
  }
  .ant-progress-text {
    display: inline-block;
    width: 2em;
    margin-left: 2px;
    color: ${props => redAmberGreen(props.progressColor)};
    font-size: 1em;
    line-height: 1;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    word-break: normal;
  }
`;

const DiscussionItem = styled.div`
  //display: flex;
  //justify-content: center;
  //align-items: center;
  text-align: center;
  background: ${props =>
    props.active ? "rgba(175, 175, 175, 0.4)" : "transparent"};
  ${Utils.MediaQuery.xs} {
    //display: inline-block;
    background: transparent;
  }
  a {
    min-height: 20px;
    //padding: 16px 5px;
    ${Utils.MediaQuery.xs} {
      padding: 0;
    }
    img {
      width: 30px;
      height: auto;
    }
  }
`;

const Wrapper = styled.div`
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .my-tag {
    float: right;
    position: relative;
    top: -26px;
    margin-right: 14px;
    cursor: pointer;
  }
`;

const KR: React.FC<KR> = props => {
  const dispacther = useDispatch();
  const isActive = useSelector((store: any) => store.SIDEBAR_NAVIGATION);
  const [Connected, setConnected] = useState(false);
  const [Data, setData] = useState([]);
  const [IsError, setIsError] = useState(false);
  const [DrawerVisible, setDrawerVisible] = useState(false);
  const [RefreshToken, setRefreshToken] = useState(0);
  const [FormData, setFormData] = useState({});
  const history = useHistory();
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [isExpand, setisExpand] = useState(false);
  const [OpenedSUBKR, setOpenedSUBKR]: [any, Function] = useState([]);
  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    if (
      state?.roles.name === "Org Admin" ||
      state?.roles.name === "Product Admin"
    ) {
      setisAdmin(true);
    }
    setisExpand(!!state.isExpand);
  }, [state]);

  useEffect(() => {
    setisExpand(!!state?.isExpand);
  }, [state]);

  useEffect(() => {
    let tempIsAdmin: boolean = false;
    if (isAdmin || props.isMyTeamPage) {
      tempIsAdmin = true; //all KRs should be visible to managers, hence isAdmin === true if it's my team
    } else {
      tempIsAdmin = false;
    }

    HttpService.get(
      "key-results/objective/" + props.objective_id,
      {},
      {
        is_admin: tempIsAdmin,
      },
    )
      .then(res => {
        setConnected(true);
        setData(res);
      })
      .catch(() => {
        setIsError(true);
      });
  }, [props.refreshToken, props.objective_id, isAdmin]);

  const EditKR = (item: any) => {
    setFormData(item);
    setDrawerVisible(true);
  };

  const Duplicate = (item: any) => {
    delete item.id;
    setFormData(item);
    setDrawerVisible(true);
  };

  const CheckIn = (item: any) => {
    if (
      state?.roles.name === "Org Admin" ||
      state?.roles.name === "Product Admin" ||
      item.line_manager === state?.user.id
    ) {
      history.push("/performance/checkin/m/" + item.id);
    } else {
      history.push("/performance/checkin/e/" + item.id);
    }
  };

  const OpenSUBKR = (id: string, key: number) => {
    const newState = [...OpenedSUBKR];
    if (!newState.includes(id)) {
      newState.push(id);
    } else {
      newState.splice(newState.indexOf(id));
    }
    setOpenedSUBKR(newState);
  };

  const Delete = (id: string, objective_id: string) => {
    message.loading("Deleting ...");
    HttpService.delete("key-results", id + "?objective_id=" + objective_id)
      .then(() => {
        setRefreshToken(RefreshToken + 1);
        notification.success({
          message: "Success",
          description: "Key Results Deleted successfully",
        });
        history.push("/performance/my-okrs?reload=" + v4());
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Problem while deleting the key results",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  return (
    <Wrapper>
      {!Connected && <SKLoader count={props.count || 1} />}
      {Connected && !Data.length && <Empty description="No KR Added" />}
      {IsError && (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong"
          extra={
            <Button onClick={() => window.location.reload()} type="primary">
              Reload Page
            </Button>
          }
        />
      )}

      {Connected && (
        <>
          <Drawer
            visible={DrawerVisible}
            width={600}
            onClose={() => {
              setDrawerVisible(false);
            }}
            title="Key Results"
            bodyStyle={{ paddingBottom: 80 }}
          >
            <KRModifiers
              {...FormData}
              onSubmit={(val: any) => {
                if (val.id) {
                  HttpService.put("key-results", val.id, val)
                    .then(() => {
                      notification.success({
                        message: "Success",
                        description: "Key Results updated successfully",
                      });
                      setDrawerVisible(false);
                      history.push("/performance/my-okrs?reload=" + v4());
                    })
                    .catch(() => {
                      notification.error({
                        message: "Error",
                        description: "Problem while updating the Key Results",
                      });
                    });
                } else {
                  HttpService.post("key-results/single", val)
                    .then(() => {
                      notification.success({
                        message: "Success",
                        description: "Key Results Added successfully",
                      });
                      setDrawerVisible(false);
                      history.push("/performance/my-okrs?reload=" + v4());
                    })
                    .catch(() => {
                      notification.error({
                        message: "Error",
                        description: "Problem while Add the Key Results",
                      });
                    });
                }
              }}
              onCancel={() => {
                setDrawerVisible(false);
              }}
            />
          </Drawer>
          <CardWrap>
            {Data.map((item: any, index: number) => (
              <div
                key={item.id}
                style={{
                  marginTop: "2px",
                  borderTop: "1px dashed #e5e5e5",
                  paddingTop: "2px",
                }}
              >
                <Row justify={"space-around"}>
                  <Col span={1}>
                    <div className={"timeline"}>
                      <div className={"timeline-top"}></div>
                      <div className={"timeline-circle"}></div>
                      <div className={"timeline-bottom"}></div>
                    </div>
                  </Col>
                  <Col span={21}>
                    <Row>
                      <Col span={1} style={{ textAlign: "center" }}>
                        <ObjectiveTypeAvatar
                          type="user"
                          name={item.user_name}
                          image={item.user_pic}
                        />
                      </Col>
                      <Col span={9}>
                        {isExpand && (
                          <h3>
                            <a
                              href={"#" + item.id}
                              onClick={e => {
                                e.preventDefault();
                                OpenSUBKR(item.id, index);
                              }}
                            >
                              {item.description}
                            </a>
                          </h3>
                        )}
                        {!isExpand && (
                          <h3 className="truncate">
                            <a
                              href={"#" + item.id}
                              onClick={e => {
                                e.preventDefault();
                                OpenSUBKR(item.id, index);
                              }}
                            >
                              {item.description}
                            </a>
                          </h3>
                        )}
                      </Col>
                      <Col style={{ textAlign: "left" }}>
                        <Avatar
                          shape="square"
                          size="small"
                          style={{ background: "#ffffff" }}
                        />
                        &nbsp;
                        <ShareAltOutlined
                          style={{
                            fontSize: "large",
                            color: "#ffffff",
                          }}
                        />
                      </Col>
                      <Col
                        style={{
                          paddingTop: "2px",
                        }}
                      >
                        <div className="Krbadge">
                          {parseInt(item.weightage) || 0} %
                        </div>
                      </Col>
                      <Col span={4} style={{ textAlign: "center" }}>
                        {moment(item.start_date).format("DD-MMM") +
                          " to " +
                          moment(item.end_date).format("DD-MMM")}
                      </Col>
                      <Col span={4} style={{ textAlign: "center" }}>
                        <Status
                          style={{
                            width: "155px",
                            textAlign: "center",
                            marginRight: "0px",
                            textOverflow: "ellipsis",
                          }}
                          name={item.kr_status}
                        />
                      </Col>
                      <Col span={3}>
                        <ProgressCss progressColor={item.progress ?? 0}>
                          <Progress
                            format={() => `${item.progress ?? 0}%`}
                            percent={Math.round(item.progress ?? 0)}
                            type="line"
                            strokeColor={redAmberGreen(item.progress ?? 0)}
                          />
                        </ProgressCss>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={1}></Col>
                      <Col span={23}>
                        {item.is_activity && (
                          <div>
                            {isExpand && <h3>{item.activity_description}</h3>}
                            {!isExpand && (
                              <Tooltip title={item.activity_description}>
                                <div className="truncate">
                                  {item.activity_description}
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        )}
                        {!item.is_activity && (
                          <>
                            {(item.boundaries !== "none"
                              ? item.boundaries
                              : "Progressive") +
                              " " +
                              (item.target ?? "") +
                              " " +
                              (item.uom_name ?? "") +
                              (item.starting
                                ? ", Starting " + item.starting
                                : "")}
                          </>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={2}>
                    <Row>
                      <Col
                        span={12}
                        style={{
                          paddingTop: "6px",
                          overflow: "visible",
                        }}
                      >
                        <Rolecheck module="Discussions">
                          <DiscussionItem active={isActive === "discussion"}>
                            <Link
                              to={
                                state?.roles.name === "Org Admin" ||
                                state?.roles.name === "Product Admin" ||
                                item.line_manager === state?.user.id
                                  ? `/performance/checkin/m/${item.id}`
                                  : `/performance/checkin/e/${item.id}`
                              }
                            >
                              <Tooltip title="Discussions">
                                <Badge count={0} offset={[-9, 0]}>
                                  <img src={Discussion} alt="Discussion" />
                                </Badge>
                              </Tooltip>
                            </Link>
                          </DiscussionItem>
                        </Rolecheck>
                      </Col>
                      <Col
                        span={12}
                        style={{
                          paddingTop: "8px",
                          textAlign: "right",
                        }}
                      >
                        <Dropdown
                          className={"krDropdown"}
                          placement="bottomRight"
                          overlay={
                            <Menu>
                              <Menu.Item
                                className={krActions({
                                  item,
                                  isAdmin,
                                  user: state?.user?.id,
                                  type: "edit",
                                })}
                                onClick={() => {
                                  return confirm({
                                    title: (
                                      <div>
                                        This action will change the Objective
                                        Status to <b>Yet to Submit</b>
                                      </div>
                                    ),
                                    // content:
                                    //   "The Objective status is change based on the total weightage",
                                    icon: <ExclamationCircleOutlined />,
                                    className: "logout-modal",
                                    onOk() {
                                      EditKR(item);
                                    },
                                  });
                                }}
                              >
                                <Rolecheck module="Key Results" action="edit">
                                  <FormOutlined /> Edit
                                </Rolecheck>
                              </Menu.Item>
                              <Menu.Item
                                className={krActions({
                                  item,
                                  isAdmin,
                                  user: state?.user?.id,
                                  type: "duplicate",
                                })}
                                onClick={() => {
                                  return confirm({
                                    title:
                                      "This action will change the Objective status",
                                    icon: <ExclamationCircleOutlined />,
                                    content:
                                      "The Objective status is change based on the total weightage",
                                    className: "logout-modal",
                                    onOk() {
                                      Duplicate(item);
                                    },
                                  });
                                }}
                              >
                                <Rolecheck module="Key Results" action="edit">
                                  <CopyOutlined /> Duplicate
                                </Rolecheck>
                              </Menu.Item>
                              <Menu.Item
                                className={krActions({
                                  item,
                                  isAdmin,
                                  user: state?.user?.id,
                                  type: "checkin",
                                })}
                                onClick={() => CheckIn(item)}
                              >
                                <Rolecheck
                                  module="Key Results"
                                  action="checkin"
                                >
                                  <ReconciliationOutlined /> Checkin
                                </Rolecheck>
                              </Menu.Item>

                              <Menu.Item
                                className={krActions({
                                  item,
                                  isAdmin,
                                  user: state?.user?.id,
                                  type: "delete",
                                })}
                                onClick={() => {
                                  return confirm({
                                    title:
                                      "Are you sure to delete this Key Result?",
                                    icon: <ExclamationCircleOutlined />,
                                    content:
                                      "This action cannot be undo and also it will change the Objective status based on the total weightage",
                                    className: "logout-modal",
                                    onOk() {
                                      Delete(item.id, item.objective_id);
                                    },
                                  });
                                }}
                              >
                                <DeleteOutlined /> Delete
                              </Menu.Item>
                            </Menu>
                          }
                        >
                          <a
                            href="#menu"
                            className="ant-dropdown-link"
                            onClick={e => e.preventDefault()}
                          >
                            <EllipsisOutlined
                              className={"action"}
                              rotate={90}
                            />
                          </a>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {OpenedSUBKR.includes(item.id) && (
                  <KeyResultsWrap>
                    <SUBKR
                      count={parseInt(item.no_of_kr, 10)}
                      refreshToken={v4()}
                      kr_id={item.id}
                      expand={isExpand}
                      is_admin={props.is_admin}
                      objective_id={props.objective_id}
                    />
                  </KeyResultsWrap>
                )}
              </div>
            ))}
          </CardWrap>
        </>
      )}
    </Wrapper>
  );
};

export default KR;
