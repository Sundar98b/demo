import moment from "moment";
import styled from "styled-components";
import Icon, {
  ExclamationCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  PageHeader,
  Radio,
  Row,
  Tooltip,
  Upload,
  message,
  notification,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import AttachmentLists from "../../../../components/attachment-list";
import HttpService from "../../../../services/httpService";
import KRCalculate from "../../../../utils/kr-calculate";
import MessageComponent from "../../../../components/messages";
import RootPage from "../../../root";
import SKLoader from "../../../../components/skloader";
import Utils from "../../../../utils";
import { ReactComponent as ConfusedSVG } from "../../../../assets/fb-confused.svg";
import { ReactComponent as LikeSVG } from "../../../../assets/fb-like.svg";
import { ReactComponent as LoveSVG } from "../../../../assets/fb-love.svg";
import { ReactComponent as WowSVG } from "../../../../assets/fb-wow.svg";

const { Dragger } = Upload;
const { confirm } = Modal;

const Table = styled.table`
  width: 100%;
  td {
    position: relative;
    padding: 5px;
    overflow-wrap: break-word;
  }
`;

const Wrapper = styled.div`
  .ant-upload-drag {
    height: 153px;
    width: 80%;
    margin: 0 auto;
    margin-bottom: 2em;
  }
  .col-left {
    height: 80vh;
    border-right: var(--light-bdr);
  }
  .form-btn {
    border-top: var(--light-bdr);
    border-bottom: var(--light-bdr);
    padding: 5px;
    text-align: right;
    .ant-btn {
      margin-left: 8px;
    }
  }
  .msg-comp {
    position: relative;
    height: 75vh;
    #messages-scroll {
      height: 72vh;
      bottom: 0;
    }
  }
`;

const CheckInModifer: React.FC = () => {
  const history = useHistory();
  const { kr_id, role } = useParams();
  const [KRData, setKRData]: [any, Function] = useState({});
  const [isPageLoaded, setisPageLoaded]: [any, Function] = useState(false);
  const [AttachmentListss, setAttachmentListss] = useState([]);
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [Actual, setActual]: [any, Function] = useState(null);
  const [ActivityScore, setActivityScore]: [any, Function] = useState(null);
  const [Activity, setActivity] = useState("");
  const [Reaction, setReaction] = useState<string | undefined>(undefined);
  const [isAdmin, setisAdmin] = useState(false);
  const [
    enableCheckInBasedAppSettings,
    setEnableCheckInBasedAppSettings,
  ] = useState(false);

  const validateData = (data: any) => {
    if (!KRData.is_activity) {
      if (data.actual === 0) {
        return true;
      } else if (!data.actual) {
        message.error("Please fill the Actual");
        return false;
      }
    }
    if (
      KRData.is_activity &&
      (data.activity_score === null || data.activity_score === undefined)
    ) {
      message.error("Please fill the Activity Completion Percentage");
      return false;
    }
    return true;
  };

  const submitForApproval = () => {
    const data: any = {
      kr_status: "awaiting_for_approval",
      actual: Actual,
      activity_checkin: Activity,
      activity_score: ActivityScore,
    };
    const validate = validateData(data);
    if (!validate) {
      return false;
    } else {
      message.loading("Loading...");
      HttpService.put("key-results/actions/submit_for_approval", kr_id, data)
        .then(res => {
          confirm({
            title: "Are you want to Leave this Page ?",
            icon: <ExclamationCircleOutlined />,
            className: "logout-modal",
            okText: "Leave Page",
            cancelText: "Stay on page",
            onOk() {
              history.push("/performance/my-okrs");
            },
          });
        })
        .catch(() => {
          notification.error({
            description: "Something went wrong",
            message: "Error",
          });
        })
        .finally(() => {
          message.destroy();
        });
    }
  };

  const saveAsDraft = () => {
    const data: any = {
      kr_status: "draft",
      actual: Actual,
      activity_checkin: Activity,
      activity_score: ActivityScore,
    };
    const validate = validateData(data);
    if (!validate) {
      return false;
    } else {
      message.loading("Loading...");
      HttpService.put("key-results/actions/draft", kr_id, data)
        .then(res => {
          confirm({
            title: "Are you want to Leave this Page ?",
            icon: <ExclamationCircleOutlined />,
            className: "logout-modal",
            okText: "Leave Page",
            cancelText: "Stay on page",
            onOk() {
              history.push("/performance/my-okrs");
            },
          });
        })
        .catch(() => {
          notification.error({
            description: "Something went wrong",
            message: "Error",
          });
        })
        .finally(() => {
          message.destroy();
        });
    }
  };

  const Approve = () => {
    const data = {
      kr_status: "approve",
      actual: Actual,
      activity_checkin: Activity,
      activity_score: ActivityScore,
    };
    message.loading("Loading...");

    HttpService.put("key-results/actions/approve", kr_id, data)
      .then(res => {
        confirm({
          title: "Are you want to Leave this Page ?",
          icon: <ExclamationCircleOutlined />,
          className: "logout-modal",
          okText: "Leave Page",
          cancelText: "Stay on page",
          onOk() {
            history.push("/performance/my-okrs");
          },
        });
      })
      .catch(() => {
        notification.error({
          description: "Something went wrong",
          message: "Error",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  const Reject = () => {
    const data = {
      kr_status: "reject",
      actual: Actual,
      activity_checkin: Activity,
      activity_score: ActivityScore,
    };
    message.loading("Loading...");

    HttpService.put("key-results/actions/reject", kr_id, data)
      .then(res => {
        confirm({
          title: "Are you want to Leave this Page ?",
          icon: <ExclamationCircleOutlined />,
          className: "logout-modal",
          okText: "Leave Page",
          cancelText: "Stay on page",
          onOk() {
            history.push("/performance/my-okrs");
          },
        });
      })
      .catch(() => {
        notification.error({
          description: "Something went wrong",
          message: "Error",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  const AddAttachment = () => {
    const tempData: any[] = [...AttachmentListss];
    message.loading("Loading...");
    console.log(`tempData: ${tempData}`);
    HttpService.put("key-results/actions/attachments", kr_id, {
      attachments: tempData,
    })
      .then(res => {
        notification.success({
          description: "Attachment Added Successfully",
          message: "Success",
        });
      })
      .catch(() => {
        notification.error({
          description: "Something went wrong",
          message: "Error",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  useEffect(() => {
    if (AttachmentListss?.length) {
      AddAttachment();
    }
  }, [AttachmentListss]);

  const AddReaction = (reaction: any) => {
    const data = {
      reaction: reaction,
    };
    message.loading("Loading...");

    HttpService.put("key-results/actions/reactions", kr_id, data)
      .then(res => {
        notification.success({
          description: "Reaction Added Successfully",
          message: "Success",
        });
      })
      .catch(() => {
        notification.error({
          description: "Something went wrong",
          message: "Error",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  useEffect(() => {
    if (
      state?.roles.name === "Org Admin" ||
      state?.roles.name === "Product Admin"
    ) {
      setisAdmin(true);
    }
  }, [state]);

  useEffect(() => {
    if (kr_id) {
      HttpService.get("key-results/" + kr_id).then(data => {
        setisPageLoaded(true);
        setKRData(data);
        setReaction(data?.reaction);
        setAttachmentListss(data.attachments);
        setActual(data.actual);
        setActivity(data.activity_checkin);
        setActivityScore(data.activity_score);
        const enableCheckIn = Utils.checkOKRConfigForCheckin(
          state.app_settings?.settings,
          data["performance_cycle"],
        );
        setEnableCheckInBasedAppSettings(enableCheckIn);
      });
    }
  }, [kr_id, state.app_settings]);

  return (
    <RootPage>
      <div>{!isPageLoaded && <SKLoader />}</div>
      {isPageLoaded && (
        <Wrapper>
          <PageHeader
            className="site-page-header"
            onBack={() => {
              if (role === "e") {
                history.push("/performance/my-okrs");
              } else {
                history.push("/performance/my-okrs");
              }
            }}
            title="Checkin"
          />
          <Row>
            <Col className="col-left" span={12}>
              <Table>
                <tbody>
                  <tr>
                    <td>Description</td>
                    <td>:</td>
                    <td>{KRData.description} </td>
                  </tr>
                  <tr>
                    <td>Timeline</td>
                    <td>:</td>
                    <td>
                      {moment(KRData?.start_date).format("DD-MMM")}
                      &nbsp;&nbsp;
                      {moment(KRData?.end_date).format("DD-MMM")}
                    </td>
                  </tr>
                  {!KRData.is_activity && (
                    <tr>
                      <td>Starting</td>
                      <td>:</td>
                      <td>{KRData.starting ?? ""}</td>
                    </tr>
                  )}
                  {KRData.is_activity && (
                    <tr>
                      <td>
                        Activity (<strong>{KRData.activity_description}</strong>
                        )
                      </td>
                      <td>:</td>
                      <td>
                        <Input.TextArea
                          autoSize
                          onChange={e => setActivity(e.target.value)}
                          value={Activity}
                        />
                      </td>
                    </tr>
                  )}

                  {!KRData.is_activity && (
                    <>
                      <tr>
                        <td>Boundary</td>
                        <td>:</td>
                        <td>
                          {KRData.boundaries !== "none" &&
                            Utils.titleCase(KRData.boundaries || "")}
                        </td>
                      </tr>
                      <tr>
                        <td>Target</td>
                        <td>:</td>
                        <td>
                          {!KRData.is_activity &&
                            KRData.boundaries !== "none" &&
                            KRData.starting &&
                            parseFloat(KRData.starting).toLocaleString() + " "}
                          &nbsp;
                          {!KRData.is_activity &&
                            KRData.boundaries !== "none" &&
                            KRData.boundaries + " "}
                          &nbsp;
                          {!KRData.is_activity &&
                            parseFloat(KRData.target).toLocaleString()}
                          &nbsp;
                          {!KRData.is_activity && KRData.uom_name}
                          {}
                        </td>
                      </tr>
                      <tr>
                        <td>Actual</td>
                        <td>:</td>
                        <td>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={Actual}
                            onChange={e => {
                              let value: any = e.target.value;
                              console.log(`actual value: ${value}`);
                              if (
                                typeof value === "string" &&
                                !isNaN(parseFloat(value))
                              ) {
                                value = parseFloat(value);
                              } /* else if (value === 0) {
                                value = 0;
                              }*/ else {
                                value = null;
                              }
                              setActual(value);
                            }}
                            style={{ width: 250 }}
                          />
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td>Score</td>
                    <td>:</td>
                    <td>
                      {KRData.is_activity && (
                        <InputNumber
                          value={ActivityScore}
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={(value: any) => value.replace("%", "")}
                          onChange={(value: any) => setActivityScore(value)}
                        />
                      )}
                      {!KRData.is_activity && (
                        <>
                          {Math.round(
                            KRCalculate({
                              boundaries: KRData.boundaries,
                              actual: Actual,
                              target: KRData.target,
                              starting: KRData.starting,
                            }),
                          )}
                          %
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div className="form-btn">
                {(state.user.id === KRData.user_id || isAdmin) &&
                  ["approved", "inprogress", "completed"].includes(
                    KRData.objective_status,
                  ) &&
                  enableCheckInBasedAppSettings &&
                  ["open", "draft", "rejected"].includes(KRData.kr_status) && (
                    <>
                      <Button type="primary" onClick={saveAsDraft}>
                        Save as Draft
                      </Button>
                      <Button type="primary" onClick={submitForApproval}>
                        Submit for Approval
                      </Button>
                    </>
                  )}
                {(state.user.id === KRData.manager_id || isAdmin) &&
                  KRData.kr_status === "awaiting_for_approval" && (
                    <>
                      <Button type="danger" onClick={Reject}>
                        Reject
                      </Button>
                      <Button type="primary" onClick={Approve}>
                        Approve
                      </Button>
                    </>
                  )}
              </div>
              Reactions
              <div className="form-btn text-center">
                <Radio.Group
                  value={Reaction}
                  disabled={
                    KRData?.manager_id !== state?.user?.id &&
                    state?.roles?.name !== "Org Admin" &&
                    state?.roles?.name !== "Product Admin"
                  }
                  onChange={(e: any) => {
                    setReaction(e.target.value);
                    AddReaction(e.target.value);
                  }}
                >
                  <Tooltip title="Like">
                    <Radio.Button
                      style={{
                        borderTopLeftRadius: "10px",
                        borderBottomLeftRadius: "10px",
                      }}
                      value="like"
                    >
                      <Icon component={LikeSVG} />
                    </Radio.Button>
                  </Tooltip>
                  <Tooltip title="Love">
                    <Radio.Button value="love">
                      <Icon component={LoveSVG} />
                    </Radio.Button>
                  </Tooltip>

                  <Tooltip title="Wow">
                    <Radio.Button value="wow">
                      <Icon component={WowSVG} />
                    </Radio.Button>
                  </Tooltip>
                  <Tooltip title="Confused">
                    <Radio.Button
                      value="confused"
                      style={{
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                    >
                      <Icon component={ConfusedSVG} />
                    </Radio.Button>
                  </Tooltip>
                </Radio.Group>
              </div>
              <h3>Attachments</h3>
              <AttachmentLists lists={AttachmentListss} />
              <Dragger
                name="client_files"
                action="/api/attachments"
                headers={HttpService.getHeader()}
                onChange={info => {
                  const { status } = info.file;
                  if (status === "done") {
                    message.success(
                      `${info.file.name} file uploaded successfully.`,
                    );
                    let newAttachmentListss: any = [];
                    if (AttachmentListss) {
                      newAttachmentListss = [...AttachmentListss];
                    }
                    newAttachmentListss.push(info?.file?.response?.id);
                    console.log(
                      `newAttachmentListss: ${JSON.stringify(
                        newAttachmentListss,
                      )}`,
                    );
                    setAttachmentListss(newAttachmentListss);
                  } else if (status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                  }
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            </Col>

            <Col span={12}>
              <MessageComponent kr_id={kr_id || ""} />
            </Col>
          </Row>
        </Wrapper>
      )}
    </RootPage>
  );
};

export default CheckInModifer;
