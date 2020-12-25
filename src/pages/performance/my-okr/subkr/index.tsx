import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Dropdown,
  Empty,
  Menu,
  Modal,
  Result,
  Row,
  Timeline,
  Tooltip,
  message,
  notification,
} from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import HttpService from "../../../../services/httpService";
import KRModifiers from "../modifiers/kr-modifiers";
import ObjectiveTypeAvatar from "../../../../components/org-type";
import ProgressBar from "../../../../components/progress";
import SKLoader from "../../../../components/skloader";
import Status from "../../../../components/status";

const { confirm } = Modal;

interface KR {
  refreshToken: string;
  kr_id: string;
  count: number;
  expand: boolean;
  is_admin: boolean;
  objective_id: string;
}

const Card = styled.div`
  background: #fff;
  border: 1px solid #067333;
  padding: 4px 9px;
  position: relative;
  border-radius: 16px;

  top: -3px;
  .badge {
    padding: 0px 12px;
    color: #f1f1f1;
    border-radius: 18px;
    background: #7d2c9c;
    margin: 0;
    display: inline;
    margin-right: -12px;
  }
`;

const Wrapper = styled.div`
  .ant-progress-bg {
    height: 6px !important;
  }
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

const SUBKR: React.FC<KR> = props => {
  const [Connected, setConnected] = useState(false);
  const [Data, setData] = useState([]);
  const [IsError, setIsError] = useState(false);
  const [DrawerVisible, setDrawerVisible] = useState(false);
  const [RefreshToken, setRefreshToken] = useState(0);
  const [FormData, setFormData] = useState({});
  const history = useHistory();
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [isExpand, setisExpand] = useState(false);

  useEffect(() => {
    setisExpand(!!state?.isExpand);
  }, [state]);

  useEffect(() => {
    HttpService.get(
      "key-results/subkr/" + props.kr_id,
      {},
      {
        is_admin: props.is_admin,
        objective_id: props.objective_id,
      },
    )
      .then(res => {
        setConnected(true);
        setData(res);
      })
      .catch(() => {
        setIsError(true);
      });
  }, [props.refreshToken, props.kr_id, props.is_admin, props.objective_id]);

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
      {Connected && !Data.length && <Empty description="No SUB-KR Added" />}
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

          <Timeline>
            {Data.map((item: any) => (
              <Timeline.Item key={item.id}>
                <Card key={item.id}>
                  <Row justify="space-around" align="middle">
                    <Col span={1}>
                      <ObjectiveTypeAvatar
                        type="user"
                        name={item.user_name}
                        image={item.user_pic}
                      />
                    </Col>
                    <Col span={5}>
                      {isExpand && <h3>{item.description}</h3>}
                      {!isExpand && (
                        <Tooltip title={item.description}>
                          <h3 className="truncate">{item.description}</h3>
                        </Tooltip>
                      )}
                    </Col>
                    <Col span={2}>
                      <span className="badge">
                        {parseInt(item.weightage) || 0} %
                      </span>
                    </Col>
                    <Col span={3}>
                      {moment(item.start_date).format("DD-MMM") +
                        " to " +
                        moment(item.end_date).format("DD-MMM")}
                    </Col>
                    <Col span={4}>
                      {item.is_activity && (
                        <div
                          style={{
                            position: "relative",
                            top: "9px",
                          }}
                        >
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
                      {!item.is_activity &&
                        item.boundaries !== "none" &&
                        item.starting &&
                        item.starting + " "}
                      &nbsp;
                      {!item.is_activity &&
                        item.boundaries !== "none" &&
                        item.boundaries + " "}
                      {!item.is_activity && item.target}{" "}
                      {!item.is_activity && item.uom_name}
                    </Col>
                    <Col span={4}>
                      <Status name={item.kr_status} />
                    </Col>
                    <Col span={2} style={{ textAlign: "right" }}>
                      <ProgressBar
                        progress={Math.round(item.completed_percentage)}
                      />
                    </Col>
                    <Col span={1} style={{ textAlign: "right" }}>
                      <Dropdown
                        placement="bottomRight"
                        overlay={
                          <Menu>
                            <Menu.Item
                              disabled={!item.can_edit}
                              onClick={() => EditKR(item)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              disabled={!item.can_edit}
                              onClick={() => Duplicate(item)}
                            >
                              Duplicate
                            </Menu.Item>
                            <Menu.Item
                              disabled={
                                item.staus === "open" ||
                                item.staus === "yet_to_submit" ||
                                item.staus === "rejected"
                              }
                              onClick={() => CheckIn(item)}
                            >
                              Check In
                            </Menu.Item>

                            <Menu.Item
                              disabled={!item.can_delete}
                              onClick={() => {
                                return confirm({
                                  title:
                                    "Are you sure to delete this Key Result?",
                                  icon: <ExclamationCircleOutlined />,
                                  content: "This action cannot be undo",
                                  className: "logout-modal",
                                  onOk() {
                                    Delete(item.id, item.objective_id);
                                  },
                                });
                              }}
                            >
                              Delete
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <a
                          href="#menu"
                          className="ant-dropdown-link"
                          onClick={e => e.preventDefault()}
                        >
                          <EllipsisOutlined rotate={90} />
                        </a>
                      </Dropdown>
                    </Col>
                  </Row>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </>
      )}
    </Wrapper>
  );
};

export default SUBKR;
