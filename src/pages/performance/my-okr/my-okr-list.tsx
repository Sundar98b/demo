import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Modal,
  Progress,
  Row,
  Tooltip,
  message,
  notification,
} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExceptionOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FormOutlined,
  IssuesCloseOutlined,
  PercentageOutlined,
  PlusOutlined,
  RedoOutlined,
  ShareAltOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import CheckIn from "../checkin";
import EmptyImg from "../../../components/empty";
import HttpService from "../../../services/httpService";
import KR from "./kr";
import KRModifiers from "./modifiers/kr-modifiers";
import KeyResults from "./okr-modifier/key-results";
import ObjWeightage from "../approve/weightage";
import ObjectiveModifier from "./modifiers/objective-modifiers";
import ObjectiveTypeAvatar from "../../../components/org-type";
import OkrModifier from "./okr-modifier";
import ReassignModifier from "./modifiers/reassign-modifier";
import Rolecheck from "../../../components/role-check";
import SKLoader from "../../../components/skloader";
import Status from "../../../components/status";
import Utils from "../../../utils";
import objActions from "./objective-actions";
import { HasPermission } from "../../../components/topbar/menu";

interface MyOkrList {
  embed?: boolean;
  id?: string;
  cycle?: string;
  onLoad?: Function;
  isMyTeam?: boolean;
  new?: any;
  isMyTeamPage?: boolean;
  //teamSwitch?: any;
}
const { xs } = Utils.MediaQuery;
const Wrapper = styled.div`
  //border: 1px solid black;
  max-height: 68vh;
  overflow: auto;
  width: 100%;
  h3 a {
    color: #000;
  }
`;

const TopDiv = styled.div`
  border: 1px solid #850746;
  margin: 0 4px 2px 4px;
  padding: 2px;
  border-radius: 8px;
  .ant-row {
    //border: 1px solid green;
  }
  .ant-col {
    //border: 1px solid red;
  }
`;

const TopButton = styled(Button)`
  color: #ffffff;
  background: #850746;
  width: 100%;
  :hover {
    color: #ffffff;
    background: #850746;
    font-style: italic;
  }
  :active {
    color: #ffffff;
    background: #850746;
  }
  :focus {
    color: #ffffff;
    background: #850746;
  }
`;

const ObjWButton = styled(Button)`
  color: #ffffff;
  background: #850746;
  :hover {
    color: #ffffff;
    background: #850746;
    font-style: italic;
  }
  :active {
    color: #ffffff;
    background: #850746;
  }
  :focus {
    color: #ffffff;
    background: #850746;
  }
`;

const Obj = styled.div`
  background: #fff;
  margin: 7px;
  //box-shadow: 2px 0.8rem 1rem rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 5px 3px;
  border: 1px solid #d3d3d3;
  line-height: 23px;
  .ant-avatar {
    height: 1.5rem;
    width: 1.5rem;
  }
  .ant-switch {
    min-width: 33px;
    top: -2px;
  }
  .ant-divider-dashed {
    border-color: #e6e6e6;
  }
  .ant-divider-horizontal {
    margin: 5px 0;
  }
  .ant-row {
    //border: 1px solid black;
  }
  .ant-col {
    //border: 1px solid red;
    //font-weight: 600;
    color: #000000;
    overflow: hidden;
    text-align: left;
  }
  .ant-progress-text {
    font-size: 10px;
  }
  :hover {
    //background: #cf0000
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transform: scale(1, 1.03);
  }

  ::before {
    content: " ";
    display: "table";
    clear: both;
  }
  .ant-radio-group {
    float: right;
  }
  .ant-dropdown-link {
    color: #000;
  }

  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0px;
  }
  .badge {
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
  ${xs} {
    > .ant-row {
      display: block;
      > .ant-col {
        max-width: 100% !important;
        width: 100% !important;
        margin-bottom: 6px;
        > h3 {
          margin-bottom: 0px;
        }
        &.ant-col-1.text-red,
        &.ant-col-1.text-red + .ant-col {
          text-align: left !important;
        }
      }
    }
  }
`;

const KeyResultsWrap = styled.div`
  //background: rgba(255, 255, 255, 0.7490196078431373);
  //margin-top: -1px;
  //padding-left: 16px;
  ${xs} {
    .ant-timeline-item-content .ant-row {
      display: block;
      > .ant-col {
        max-width: 100% !important;
        width: 100% !important;
        margin-bottom: 6px;
        > h3 {
          margin-bottom: 0px;
        }
        &:nth-last-child(-n + 2) {
          text-align: left !important;
        }import Status from './../../../components/status/index';

      }
    }
  }
`;

const ModalFooter = styled.div`
  margin-top: 4px;
  border-top: var(--light-bdr);
  text-align: right;
  padding-top: 5px;
`;

const { confirm } = Modal;

const MyOkrList: React.FC<MyOkrList> = props => {
  const location = useLocation();
  const history = useHistory();
  const [Loading, setLoading] = useState(true);
  const [needReload, setneedReload] = useState(false);
  const [RefreshToken, setRefreshToken] = useState(1);
  const [isAdmin, setisAdmin] = useState(false);
  const [EditFD, setEditFD] = useState({});
  const [EditDrawerVisible, setEditDrawerVisible] = useState(false);
  const [reassignDrawerVisible, setRessignDrawerVisible] = useState(false);
  const [AddKRFD, setAddKRFD] = useState({});
  const [AddKRDrawerVisible, setAddKRDrawerVisible] = useState(false);
  const [EditKRProps, setEditKRProps]: [any, Function] = useState({});
  const [isExpand, setisExpand] = useState(false);
  const [EditKRWeightageLoading, setEditKRWeightageLoading] = useState(false);
  const [isEditKRWeightageVisible, setisEditKRWeightageVisible] = useState(
    false,
  );
  const [
    isKRWeightageDistributeEqually,
    setIsKRWeightageDistributeEqually,
  ] = useState<boolean>(false);
  const [totalWeightage, settotalWeightage] = useState(0);
  const [objectives, setobjectives] = useState([]);
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [selectKRId, setselectKRId] = useState("");
  const [selectedKRItem, setselectedKRItem] = useState([]);
  const [objForDuplicate, setObjForDuplicate] = useState<any>();
  const [objGoals, setObjGoals] = useState<any>();
  const [OkRAdd, setOkRAdd] = useState(false);
  const [appApprovalSettings, setAppApprovalSettings] = useState<any>(
    undefined,
  );
  const [DrawerVisisble, setDrawerVisisble] = useState(
    location.pathname.includes("/my-okrs/new"),
  );
  //const [CurrentTab, setCurrentTab] = useState(props.teamSwitch ?? "okr");
  const [OpenedKR, setOpenedKR]: [any, Function] = useState([]);
  const [CurrentCycle, setCurrentCycle] = useState();
  const [CurrentTimeline, setCurrentTimeline] = useState("");
  const [isCheckinPage, setIsCheckinPage] = useState(false);
  const [openObjWeightageModal, setOpenObjWeightageModal] = useState(false);
  const [overallPerformance, setOverallPerformance] = useState(0);
  const [topDivCountData, setTopDivCountData] = useState({
    current: 0,
    overdue: 0,
    upcoming: 0,
  });

  // useEffect(() => {
  //   if (props.teamSwitch) {
  //     setCurrentTab(props.teamSwitch);
  //   }
  // }, [props.teamSwitch]);

  const EnabledModule = state?.product_settings?.settings;
  const roles = state?.roles?.role;
  const _HasPermission = (key: any) => {
    return HasPermission(key, roles, EnabledModule, state);
  };

  const calculateKRWeightage = () => {
    if (selectedKRItem) {
      let totalWeightage = 0;
      selectedKRItem.forEach((item: any) => {
        totalWeightage += item.weightage || 0;
      });
      settotalWeightage(totalWeightage);
    }
  };

  useEffect(() => {
    if (props.new) {
      setDrawerVisisble(props.new);
      setObjForDuplicate(undefined);
    }
  }, [props.new]);

  useEffect(() => {
    calculateKRWeightage();
  }, [selectedKRItem]);

  useEffect(() => {
    if (location.search.includes("reload")) {
      setneedReload(true);
    }
  }, [location]);

  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    setAppApprovalSettings(state?.app_settings?.settings?.obj_new_approval);
    setCurrentTimeline(filter.performance_cycle);
    setisExpand(state.isExpand);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (CurrentCycle || CurrentTimeline) {
      HttpService.get(
        "insights/my-performance",
        {},
        { performance_cycle: CurrentTimeline },
      ).then(res => {
        if (res.performance) {
          setOverallPerformance(res.performance);
        } else {
          setOverallPerformance(0);
        }
      });
      HttpService.get(`key-results/count-by-timeline/${CurrentTimeline}`).then(
        res => {
          if (res) {
            setTopDivCountData(res[0]);
            console.log(`topDiv data: ${JSON.stringify(res[0])}`);
          }
        },
      );
    }
  }, [CurrentTimeline, CurrentCycle]);

  useEffect(() => {
    setDrawerVisisble(location.pathname.includes("/my-okrs/new"));
  }, [location.pathname]);
  useEffect(() => {
    if (!props.embed) {
      if (DrawerVisisble) {
        history.push("/performance/my-okrs/new");
      } else {
        history.push("/performance/my-okrs");
      }
    }
  }, [DrawerVisisble, history, props.embed]);

  const toggleDrawer = () => {
    setDrawerVisisble(!DrawerVisisble);
    setObjForDuplicate(undefined);
    // setIsDuplicate(false);
  };

  const openEditKRWeightage = (id: string) => {
    setisEditKRWeightageVisible(true);
    setEditKRWeightageLoading(true);
    HttpService.get("key-results/objective/" + id).then(res => {
      setEditKRWeightageLoading(false);
      setselectedKRItem(res);
    });
  };

  const SaveKRWeightage = () => {
    const items = [...selectedKRItem];
    const objStatus: any =
      !appApprovalSettings || isAdmin ? "approved" : "awaiting_for_approval";
    HttpService.put("objectives/actions/kr-weightage", selectKRId, {
      krs: items,
      objective_status: objStatus,
    })
      .then(() => {
        notification.success({
          message: "Success",
          description: "Weightage saved successfully",
        });
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Error saving weightage",
        });
      })
      .finally(() => {
        setisEditKRWeightageVisible(false);
        history.push("/performance/my-okrs?reload=" + v4());
      });
  };
  const OpenKeyResults = (id: string, key: number) => {
    const newState = [...OpenedKR];
    if (!newState.includes(id)) {
      newState.push(id);
    } else {
      newState.splice(newState.indexOf(id));
    }
    setOpenedKR(newState);
  };

  useEffect(() => {
    setisAdmin(
      state?.roles.name === "Org Admin" ||
        state?.roles.name === "Product Admin",
    );
    setisExpand(!!state.isExpand);
  }, [state]);
  useEffect(() => {
    setOkRAdd(false);

    if (state?.user?.id || props.id) {
      if (
        CurrentTimeline &&
        !location.pathname.includes("/performance/my-okrs/new")
      ) {
        setLoading(true);
        const id = props.id || state?.user?.id;
        HttpService.get("objectives/users/" + id, "", {
          cycle: CurrentTimeline,
        }).then(res => {
          setobjectives(res);
          setLoading(false);
          if (props.onLoad) {
            props.onLoad();
          }
        });
        HttpService.get("goals").then(res => {
          setObjGoals(res.data);
        });
      }
    }
  }, [
    //CurrentCycle,
    CurrentTimeline,
    // state,
    needReload,
    RefreshToken,
    props.id,
    //props,
    location.pathname,
  ]);

  // const onRadioChange = (e: any) => {
  //   setCurrentTab(e.target.value);
  // };

  const UpdateObj = (id: string, data: any) => {
    message.loading("Updating");

    HttpService.put("objectives", id, data)
      .then(res => {
        notification.success({
          message: "Updated",
          description: "Objective Updated Successfully",
        });
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Problem while updating the Objectives",
        });
      })
      .finally(() => {
        message.destroy();
        setRefreshToken(RefreshToken + 1);
      });
  };

  const DeleteObj = (id: string) => {
    message.loading("Loading...");
    HttpService.delete("objectives", id)
      .then(() => {
        notification.success({
          message: "Success",
          description: "Objective has been deleted",
        });
        setRefreshToken(RefreshToken + 1);
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Problem while delete the objective",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  const Actions = (id: string, action: string, items: any = {}) => {
    switch (action) {
      case "approve":
        message.loading("Loading...");
        HttpService.put("objectives/actions/approve", id, {})
          .then(res => {
            notification.success({
              message: "Approved",
              description: "Objective Approved Successfully",
            });
          })
          .catch(() => {
            notification.error({
              message: "Something went wrong",
            });
          })
          .finally(() => {
            message.destroy();
          });

        break;
      case "reject":
        UpdateObj(id, {
          status: "rejected",
        });

        break;
      case "duplicate":
        setObjForDuplicate(items);
        setDrawerVisisble(!DrawerVisisble);
        //setIsDuplicate(true);

        break;
      case "reassign":
        setEditFD(items);
        setRessignDrawerVisible(true);
        break;
      case "reopen":
        UpdateObj(id, {
          status: "open",
        });

        break;
      case "edit":
        setEditFD(items);

        setEditDrawerVisible(true);
        break;
      case "edit-kr-weightage":
        openEditKRWeightage(id);
        setselectKRId(id);
        break;
      case "edit-kr":
        const krProps = {
          description: items.description,
          start: items.start_date,
          end: items.end_date,
          kpi: state?.product_settings?.settings?.KPI,
          objective_id: items.id,
          assignRule: state?.app_settings?.settings?.assign,
          objectiveType: items.objective_type,
          user_id: items.user_id,
          cycle: items.cycle,
          user_name: items.user_name,
          items: [],
          isEditPage: true,
          performance_cycle: items.performance_cycle,
        };
        message.loading("Loading");
        HttpService.get("key-results/objective/" + krProps.objective_id)
          .then((res: any) => {
            krProps.items = res;
            setEditKRProps(krProps);
            setOkRAdd(true);
          })
          .catch(() => {})
          .finally(() => {
            message.destroy();
          });

        break;
      case "add-kr":
        setAddKRFD({
          start_date: items.start_date,
          end_date: items.end_date,
          objective_id: items.id,
          objective_type: items.objective_type,
          performance_cycle: items.performance_cycle,
          cycle: items.cycle,
        });
        setAddKRDrawerVisible(true);
        break;
      case "delete":
        confirm({
          title: "Do you Want to delete these Objective & Its KR?",
          icon: <ExclamationCircleOutlined />,
          content: "This action cannot be undo",
          className: "logout-modal",
          onOk() {
            DeleteObj(id);
          },
        });
        break;
      case "submit_for_approval":
        message.loading("Loading...");
        HttpService.put("objectives/actions/submit_for_approval/", id, {
          status: "awaiting_for_approval",
        })
          .then(res => {
            notification.success({
              message: "Objective successfuly sent for the Approval",
            });
          })
          .catch(() => {
            notification.error({
              message: "Something went wrong",
            });
          })
          .finally(() => {
            message.destroy();
          });
        break;
      default:
        break;
    }
  };

  const equallyDistributeKRWeightage = () => {
    if (selectedKRItem.length > 0) {
      let tempStateData = selectedKRItem;
      const tempWeightage = Math.floor(100 / tempStateData.length);
      let total: number = 0;
      tempStateData?.forEach((item: any, index: number) => {
        if (index < tempStateData?.length - 1) {
          item.weightage = tempWeightage;
          total += tempWeightage;
        }
        if (index === tempStateData?.length - 1) {
          item.weightage = 100 - total;
        }
      });
      setselectedKRItem(tempStateData);
      calculateKRWeightage();
    }
  };

  const changeKRWeightage = (value: any, index: number) => {
    const selectedKRItemMuted = [...selectedKRItem];
    // @ts-ignore
    selectedKRItem[index].weightage = parseInt(value);
    setselectedKRItem(selectedKRItemMuted);
  };

  const CheckforReassign = (item: any) => {
    if (props.isMyTeam && item.status === "approved") {
      return "";
    } else return "hide";
  };

  const getGoalDescription = (item: any) => {
    let Goal: string = "";
    if (item.goal_id) {
      objGoals?.filter((item1: any) => {
        if (item1.id === item.goal_id) {
          Goal = item1.description;
        }
      });
    }
    return Goal;
  };

  const CheckinToggle = () => {
    setIsCheckinPage(true);
  };

  return (
    <>
      {openObjWeightageModal && (
        <ObjWeightage
          userId={state?.user?.id || props.id}
          isModalVisible={openObjWeightageModal}
          setIsModalVisible={setOpenObjWeightageModal}
        />
      )}
      <Modal
        visible={isEditKRWeightageVisible}
        title="Edit KR Weightage"
        footer={null}
        onCancel={() => {
          setisEditKRWeightageVisible(false);
        }}
      >
        {EditKRWeightageLoading && <SKLoader />}
        {!EditKRWeightageLoading && (
          <>
            <table className="c-table fw">
              <thead>
                <tr>
                  <th>KR Description</th>
                  <th>Weightage</th>
                </tr>
              </thead>
              <tbody>
                {selectedKRItem.map((item: any, index: number) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>
                      <Input
                        type="number"
                        value={item.weightage}
                        onChange={val =>
                          changeKRWeightage(val.currentTarget.value, index)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th style={{ textAlign: "right", paddingRight: 5 }}>Total</th>
                  <th>
                    <Input value={totalWeightage} readOnly />
                  </th>
                </tr>
              </tfoot>
            </table>
            <ModalFooter>
              <Row style={{ width: "100%" }}>
                <Col span={12} style={{ textAlign: "left" }}>
                  <Checkbox
                    checked={isKRWeightageDistributeEqually}
                    onChange={(e: any) => {
                      if (e.target.checked) {
                        equallyDistributeKRWeightage();
                        setIsKRWeightageDistributeEqually(true);
                      } else {
                        setIsKRWeightageDistributeEqually(false);
                      }
                    }}
                  >
                    Distribute Equally
                  </Checkbox>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Button
                    type="primary"
                    onClick={SaveKRWeightage}
                    disabled={totalWeightage !== 100}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </ModalFooter>
          </>
        )}
      </Modal>
      <Drawer
        title="Edit KRS"
        visible={OkRAdd}
        width={1100}
        onClose={() => {
          setOkRAdd(false);
        }}
      >
        <KeyResults {...EditKRProps} />
      </Drawer>

      <Drawer
        visible={AddKRDrawerVisible}
        width={600}
        onClose={() => {
          setAddKRDrawerVisible(false);
        }}
        title="Key Results"
        bodyStyle={{ paddingBottom: 80 }}
      >
        <KRModifiers
          {...AddKRFD}
          onSubmit={(val: any) => {
            HttpService.post("objectives/actions/add-kr", val)
              .then(() => {
                notification.success({
                  message: "Success",
                  description: "Key Results Added successfully",
                });
                setAddKRDrawerVisible(false);
                history.push("/performance/my-okrs?reload=" + v4());
              })
              .catch(e => {
                notification.error({
                  message: "Error",
                  description: "Problem while updating the Key Results",
                });
              });
          }}
          onCancel={() => {
            setAddKRDrawerVisible(false);
          }}
        />
      </Drawer>

      <Drawer
        title="New Objective"
        visible={DrawerVisisble}
        width={1100}
        onClose={toggleDrawer}
      >
        <OkrModifier
          refreshToken={v4()}
          objectiveItem={objForDuplicate}
          isAdmin={!!props.embed}
          // isDuplicate = {isDuplicate}
        />
      </Drawer>

      <Drawer
        title="Edit Objective"
        visible={EditDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        width={600}
        className="modal-obj"
        onClose={() => {
          setEditDrawerVisible(false);
        }}
      >
        <ObjectiveModifier
          {...EditFD}
          refreshToken={v4()}
          onCancel={() => {
            setEditDrawerVisible(false);
          }}
          onSubmit={(val: any) => {
            HttpService.put("objectives", val.id, val)
              .then(res => {
                setEditDrawerVisible(false);
                setRefreshToken(RefreshToken + 1);
                notification.success({
                  message: "Success",
                  description: "Objective updated successfully",
                });
              })
              .catch(err => {
                console.error(err);
                notification.error({
                  message: "Error",
                  description: "Problem while updating objective",
                });
              });
          }}
        />
      </Drawer>
      <Drawer
        title="Reassign Objective"
        visible={reassignDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        width={600}
        className="modal-obj"
        onClose={() => {
          setRessignDrawerVisible(false);
        }}
      >
        <ReassignModifier
          {...EditFD}
          refreshToken={v4()}
          onCancel={() => {
            setRessignDrawerVisible(false);
          }}
          onSubmit={(val: any) => {
            if (val.id && val.user_id) {
              let Data = {
                id: val.id,
                status: "yet_to_submit",
                assign_to: val.user_id,
              };
              HttpService.put("objectives/re-assign", val.id, Data)
                .then(res => {
                  setRessignDrawerVisible(false);
                  setRefreshToken(RefreshToken + 1);
                  notification.success({
                    message: "Success",
                    description: "Reassigned successfully",
                  });
                })
                .catch(err => {
                  console.error(err);
                  notification.error({
                    message: "Error",
                    description: "Problem while Reassigning",
                  });
                });
            }
          }}
        />
      </Drawer>
      {/* <Div>
        {!props.embed && (
          <>
            {state?.user?.is_manager && (
              <Radio.Group onChange={onRadioChange} value={CurrentTab}>
                <Radio value={"okr"}>My View</Radio>
                <Radio value={"my-team"}>My Team</Radio>
              </Radio.Group>
            )}

            <Rolecheck module="Objective" action="create">
              <Button type="primary" onClick={toggleDrawer} size="small">
                New
              </Button>
            </Rolecheck>
          </>
        )}
      </Div> */}
      {!isCheckinPage && (
        <Wrapper className="obj-wrapper" key={RefreshToken}>
          {/* {CurrentTab === "my-okrs" && ( */}
          <>
            {!props.isMyTeamPage && (
              <TopDiv>
                <Row>
                  <Col
                    span={2}
                    style={{ textAlign: "center", paddingTop: "5px" }}
                  >
                    <strong>{CurrentTimeline}</strong>
                  </Col>
                  <Col span={5} style={{ paddingTop: "5px" }}>
                    Overall Performance &nbsp;
                    <strong>
                      {Utils.round((overallPerformance ?? 0) + "")}%
                    </strong>
                  </Col>
                  <Col span={4} style={{ paddingTop: "5px" }}>
                    Overdue KRs &nbsp;
                    <strong>
                      {Utils.round((topDivCountData?.overdue ?? 0) + "")}
                    </strong>
                  </Col>
                  <Col span={4} style={{ paddingTop: "5px" }}>
                    Current KRs &nbsp;
                    <strong>
                      {Utils.round((topDivCountData?.current ?? 0) + "")}
                    </strong>
                  </Col>
                  <Col span={4} style={{ paddingTop: "5px" }}>
                    Upcoming KRs &nbsp;
                    <strong>
                      {Utils.round((topDivCountData.upcoming ?? 0) + "")}
                    </strong>
                  </Col>
                  <Col span={3}>
                    {state?.product_settings?.settings[
                      "Performance Management"
                    ] && (
                      <ObjWButton
                        onClick={() => setOpenObjWeightageModal(true)}
                      >
                        {"Obj Weightage"}
                      </ObjWButton>
                    )}
                  </Col>
                  <Col span={2}>
                    <TopButton onClick={CheckinToggle}>Checkin</TopButton>
                  </Col>
                </Row>
              </TopDiv>
            )}
            {Loading && <SKLoader />}
            {!Loading && !objectives.length && (
              <EmptyImg
                description={
                  <>
                    No OKR is available for Performance Cycle &nbsp;
                    <strong>{CurrentTimeline}</strong>
                  </>
                }
              ></EmptyImg>
            )}
            {!Loading && (
              <>
                {objectives.map((item: any, index: number) => (
                  <div key={item.id}>
                    <Obj>
                      <Row justify={"space-around"}>
                        <Col span={1} style={{ textAlign: "center" }}>
                          <ObjectiveTypeAvatar
                            type={"user"}
                            name={item.user_name}
                            image={item.user_pic}
                          />
                        </Col>
                        <Col span={21}>
                          <Row>
                            <Col span={10}>
                              {isExpand && (
                                <h3 style={{ fontWeight: 600 }}>
                                  <a
                                    href={"#" + item.id}
                                    onClick={e => {
                                      e.preventDefault();
                                      OpenKeyResults(item.id, index);
                                    }}
                                  >
                                    {item.description}
                                  </a>
                                </h3>
                              )}
                              {!isExpand && (
                                <h3
                                  style={{ fontWeight: 600 }}
                                  className="truncate"
                                >
                                  <a
                                    href={"#" + item.id}
                                    onClick={e => {
                                      e.preventDefault();
                                      OpenKeyResults(item.id, index);
                                    }}
                                  >
                                    {item.description}
                                  </a>
                                </h3>
                              )}
                            </Col>
                            <Col style={{ textAlign: "left" }}>
                              <ObjectiveTypeAvatar
                                type={item.objective_type}
                                name={item.user_name}
                                image={item.user_pic}
                              />
                              &nbsp;
                              <Tooltip title={item.is_shared ? "Shared" : ""}>
                                <ShareAltOutlined
                                  style={{
                                    fontSize: "large",
                                    color: `${
                                      item.is_shared ? "#000000" : "#ffffff"
                                    }`,
                                    fontWeight: 600,
                                  }}
                                />
                              </Tooltip>
                            </Col>
                            <Col
                              style={{
                                paddingTop: "2px",
                              }}
                            >
                              {_HasPermission("Performance Management") ? (
                                <div className="badge">
                                  {parseInt(item.user_objective_weightage) || 0}{" "}
                                  %
                                </div>
                              ) : (
                                <div style={{ width: "4rem" }}>{""}</div>
                              )}
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
                                name={item.status}
                              />
                            </Col>
                            <Col span={3}></Col>
                          </Row>
                          <Row>
                            <Col span={5}>
                              {Utils.titleCase(item.category) + " "}
                            </Col>
                            <Col span={19}>{getGoalDescription(item)}</Col>
                          </Row>
                        </Col>
                        <Col span={2} style={{ width: "100%" }}>
                          <Row>
                            <Col
                              span={12}
                              style={{
                                position: "relative",
                                textAlign: "center",
                              }}
                            >
                              <Progress
                                format={() => `${item.progress ?? 0}%`}
                                type="circle"
                                width={46}
                                strokeWidth={10}
                                strokeColor={Utils.redAmberGreenStroke(
                                  item.progress
                                    ? item.progress === 0
                                      ? 1
                                      : item.progress
                                    : 0,
                                )}
                                percent={
                                  item.progress
                                    ? item.progress === 0
                                      ? 1
                                      : item.progress
                                    : 0
                                }
                              />
                            </Col>
                            <Col
                              span={12}
                              style={{
                                position: "relative",
                                paddingTop: "8px",
                                textAlign: "right",
                              }}
                            >
                              <Dropdown
                                placement="bottomRight"
                                trigger={["click"]}
                                overlay={
                                  <Menu>
                                    <Menu.Item
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "edit-kr-weightage",
                                      })}
                                      onClick={() => {
                                        Actions(item.id, "edit-kr-weightage");
                                      }}
                                    >
                                      <PercentageOutlined /> Edit KR Weightage
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "add-kr", item);
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "add-kr",
                                      })}
                                    >
                                      <PlusOutlined /> Add KR
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "edit", item);
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "edit",
                                      })}
                                    >
                                      <Rolecheck
                                        module="Objective"
                                        action="edit"
                                      >
                                        <FormOutlined /> Edit
                                      </Rolecheck>
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "delete");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "delete",
                                      })}
                                    >
                                      <Rolecheck
                                        module="Objective"
                                        action="delete"
                                      >
                                        <DeleteOutlined /> Delete
                                      </Rolecheck>
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "duplicate", item);
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "duplicate",
                                      })}
                                    >
                                      <Rolecheck
                                        module="Objective"
                                        action="edit"
                                      >
                                        <CopyOutlined /> Duplicate OKR
                                      </Rolecheck>
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "approve");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "submit_for_approval",
                                      })}
                                    >
                                      <ExceptionOutlined /> Submit for Approval
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "submit_for_closure");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "submit_for_closure",
                                      })}
                                    >
                                      <IssuesCloseOutlined /> Submit for Closure
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "request_to_reopen");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "request_to_reopen",
                                      })}
                                    >
                                      <IssuesCloseOutlined /> Request to Reopen
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "approve");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "approve",
                                      })}
                                    >
                                      <FileDoneOutlined /> Approve
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "reject");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "reject",
                                      })}
                                    >
                                      <FileExcelOutlined /> Reject
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "close");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "reject",
                                      })}
                                    >
                                      <IssuesCloseOutlined /> Close
                                    </Menu.Item>
                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "reopen");
                                      }}
                                      className={objActions({
                                        item,
                                        isAdmin,
                                        user: state?.user?.id,
                                        type: "reopen",
                                      })}
                                    >
                                      <RedoOutlined /> Reopen
                                    </Menu.Item>

                                    <Menu.Item
                                      onClick={() => {
                                        Actions(item.id, "reassign", item);
                                      }}
                                      className={CheckforReassign(item)}
                                    >
                                      <UserSwitchOutlined /> Reassign
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
                                    style={{ fontSize: "30px" }}
                                    rotate={90}
                                  />
                                </a>
                              </Dropdown>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      {OpenedKR.includes(item.id) && (
                        <>
                          <KeyResultsWrap>
                            <KR
                              count={parseInt(item.no_of_kr, 10)}
                              refreshToken={v4()}
                              objective_id={item.id}
                              expand={isExpand}
                              is_admin={!!props.embed}
                              isMyTeamPage={props.isMyTeamPage}
                            />
                          </KeyResultsWrap>
                        </>
                      )}
                    </Obj>
                  </div>
                ))}
                &nbsp; &nbsp;
              </>
            )}
          </>
          {/* )} */}
        </Wrapper>
      )}

      {isCheckinPage && <CheckIn />}
    </>
  );
};

export default MyOkrList;
MyOkrList.defaultProps = {
  embed: false,
  isMyTeam: false,
};
