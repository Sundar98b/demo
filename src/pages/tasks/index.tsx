import moment from "moment";
import styled from "styled-components";
import useMedia from "use-media";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Modal,
  Radio,
  Row,
  Tabs,
  notification,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import Actions from "../../components/actions";
import HttpService from "../../services/httpService";
import PerformanceCard from "./performance-card";
import Rolecheck from "../../components/role-check";
import RootPage from "../root";
import TaskModifier from "./task-modifier";
import TaskTable from "./task-table";
import UserChip from "../../components/user-chip";

const { confirm } = Modal;
const Pane = Tabs.TabPane;
const redAmberGreen = (str: string) => {
  if (str === "Overdue") {
    return "red";
  } else if (str === "Open" || str === "Inprogress") {
    return "#ffa726";
  } else if (str === "Completed") {
    return "#43a047";
  }
};

const Titlewrap = styled.div`
  height: 45px;
`;
const Titlemenu = styled.div`
  float: left;
  width: 90%;
`;

const Warpper = styled.div`
  min-height: 70vh;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    background: #e0d9d9;
    margin-right: 9px;
    border-radius: 3px 3px 0 0;
    border: none;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    height: 40px;
    color: #3f4040;
    background: #f5f0f0;
    border-bottom: none;
  }

  .ant-tabs-bar {
    margin-bottom: 0;
  }
  .ant-tabs-content {
    min-height: 70vh;
    background: #f5f0f0;
    border-radius: 0 0 6px 6px;
  }
`;

const RadioCss = styled.div`
  .ant-radio-inner {
    border-color: ${props => redAmberGreen(props.status)};
  }
  .ant-radio-inner::after {
    background-color: ${props => redAmberGreen(props.status)};
  }
`;

interface locationData {
  id: string;
  name: string;
  description: string;
  target_date: string;
  priority: string;
  status: string;
}
const EmptyData = {
  id: "",
  name: "",
  description: "",
  target_date: "",
  priority: "",
  status: "",
};
interface StatusInfo {
  status: string;
  count: number;
}
interface StatusChartInfo {
  Open: StatusInfo;
  Completed: StatusInfo;
  Inprogress: StatusInfo;
  Overdue: StatusInfo;
  total: number;
}
const Tasks: React.FC = () => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [formData, setformData] = useState(EmptyData);
  const [Title, setTitle] = useState("New");
  const isMobile = useMedia("(max-width: 767px)") ? true : false;
  const [RefreshToken, setRefreshToken] = useState(Math.random());
  const [Key, setKey] = useState({
    my: v4(),
    team: v4(),
  });
  const [CurrentTab, setCurrentTab] = useState("MyTask");
  const [myStatusInfo, setMyStatusInfo] = useState<StatusChartInfo | undefined>(
    undefined,
  );
  const [teamStatusInfo, setTeamStatusInfo] = useState<
    StatusChartInfo | undefined
  >(undefined);
  const [statusInfo, setStatusInfo] = useState<StatusChartInfo | undefined>(
    undefined,
  );
  const [btnloader, setbtnloader] = useState(false);
  const [isMyTeamTask, setIsMyTeamTask] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const OnTabChange = (tab: string) => {
    setCurrentTab(tab);
    console.log(`current tab: ${tab}`);
    setKey({ my: v4(), team: v4() });
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const onClose = () => {
    setDrawerVisible(false);
    setformData(EmptyData);
  };

  const OnEdit = (row: locationData) => {
    let data = Object.assign({}, row, {
      target_date: moment(row.target_date),
    });
    setformData(data);
    setTitle("Edit");
    toggleDrawer();
  };
  const OnNew = () => {
    setformData(EmptyData);
    setTitle("New");
    toggleDrawer();
  };
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("new")) {
      OnNew();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const OnDelete = (row: locationData) => {
    HttpService.delete("tasks", row?.id)
      .then((res: any) => {
        notification.success({
          message: "Success",
          description: "Task deleted successfully",
        });
        setRefreshToken(Math.random());
      })
      .catch(() => {
        notification.error({
          message: "Failed",
          description: "Unable to delete Task",
        });
      })
      .finally(() => {});
  };

  const radioOnClick = (item: any) => {
    let tempStatus = item.status;
    if (item.status === "Completed") {
      console.log(`moment :${moment()}`);
      if (item.target_date < moment().format()) {
        tempStatus = "Overdue";
      } else {
        tempStatus = "Open";
      }
    }
    if (item.status !== "Completed") {
      tempStatus = "Completed";
    }
    confirm({
      title: `Are you sure you want to Change the status to ${tempStatus} ?`,
      icon: <ExclamationCircleOutlined />,
      className: "logout-modal",
      okText: "Change",
      cancelText: "Stay on page",
      onOk() {
        OnSubmit({ ...item, status: tempStatus });
      },
    });
  };

  const columns = [
    {
      name: "",
      key: "status",
      sortable: true,
      width: isMobile ? undefined : "5%",
      render: (tr: any) => {
        return (
          <RadioCss status={tr.status}>
            <Radio
              checked={tr.status === "Completed" ? true : false}
              style={{ width: "100%" }}
              onClick={(event: any) => {
                radioOnClick(tr);
              }}
            />
          </RadioCss>
        );
      },
    },
    {
      name: "Task Description",
      key: "name",
      sortable: true,
      width: isMobile ? undefined : "60%",
    },
    {
      name: "Target Date",
      key: "target_date",
      sortable: true,
      width: isMobile ? undefined : "15%",
      render: (tr: any) => {
        return <span>{moment(tr["target_date"]).format("DD-MMM-YYYY")}</span>;
      },
    },
    {
      name: "Priority",
      key: "priority",
      sortable: false,
      width: isMobile ? undefined : "10%",
    },
    {
      name: "Actions",
      width: isMobile ? undefined : "10%",
      render: (row: locationData) => {
        return (
          <>
            <Actions
              module={"Tasks"}
              row={row}
              onDelete={OnDelete}
              onEdit={OnEdit}
            />
          </>
        );
      },
    },
  ];

  const columns2 = [
    {
      name: "",
      key: "status",
      sortable: true,
      width: isMobile ? undefined : "5%",
      render: (tr: any) => {
        return (
          <RadioCss status={tr.status}>
            <Radio
              checked={tr.status === "Completed" ? true : false}
              style={{ width: "100%" }}
            />
          </RadioCss>
        );
      },
    },
    {
      name: "Task Description",
      key: "name",
      sortable: true,
      width: isMobile ? undefined : "50%",
    },
    {
      name: "Owner",
      key: "user_display_name",
      sortable: true,
      width: isMobile ? undefined : "20%",
      render: (row: any) => {
        return <UserChip name={row.user_display_name} img={row.user_logo} />;
      },
    },
    {
      name: "Target Date",
      key: "target_date",
      sortable: true,
      width: isMobile ? undefined : "15%",
      render: (tr: any) => {
        return <span>{moment(tr["target_date"]).format("DD-MMM-YYYY")}</span>;
      },
    },
    {
      name: "Priority",
      key: "priority",
      sortable: false,
      width: isMobile ? undefined : "10%",
    },
  ];

  const OnSubmit = (row: locationData) => {
    setbtnloader(true);
    if (!row.id || row.id === "") {
      // delete row.id;
      HttpService.post("tasks/bulk-create", row)
        .then((res: any) => {
          notification.success({
            message: "Success",
            description: "Task added successfully",
          });
          setRefreshToken(Math.random());
          onClose();
          setbtnloader(false);
        })
        .catch(() => {
          notification.error({
            message: "Failed",
            description: "Unable to add Task",
          });
          setformData(EmptyData);
          onClose();
          setbtnloader(false);
        })
        .finally(() => {});
    } else {
      HttpService.put("tasks", row.id, row)
        .then((res: any) => {
          notification.success({
            message: "Success",
            description: "Task Updated successfully",
          });
          setRefreshToken(Math.random());
          onClose();
          setbtnloader(false);
        })
        .catch(() => {
          notification.error({
            message: "Failed",
            description: "Unable to update Task",
          });
          setformData(EmptyData);
          onClose();
          setbtnloader(false);
        })
        .finally(() => {});
    }
  };
  useEffect(() => {
    HttpService.get("tasks/my-tasks-status").then(res => {
      const status: any = {
        Completed: {
          status: res["data"]["Completed"]["status"],
          count: res["data"]["Completed"]["count"]
            ? parseInt(res["data"]["Completed"]["count"])
            : 0,
        },
        Overdue: {
          status: res["data"]["Overdue"]["status"],
          count: res["data"]["Overdue"]["count"]
            ? parseInt(res["data"]["Overdue"]["count"])
            : 0,
        },
        Inprogress: {
          status: res["data"]["Inprogress"]["status"],
          count: res["data"]["Inprogress"]["count"]
            ? parseInt(res["data"]["Inprogress"]["count"])
            : 0,
        },
        Open: {
          status: res["data"]["Open"]["status"],
          count:
            res["data"]["Open"]["count"] || res["data"]["Inprogress"]["count"]
              ? (parseInt(res["data"]["Inprogress"]["count"]) ?? 0) +
                (parseInt(res["data"]["Open"]["count"]) ?? 0)
              : 0,
        },
      };

      const temp = {
        ...status,
        total:
          res["total"] && res["total"][0]["totaltasks"]
            ? parseInt(res["total"][0]["totaltasks"])
            : 0,
      };

      setMyStatusInfo({
        ...temp,
      });
    });
    HttpService.get("tasks/team-tasks-status").then(res => {
      const status: any = {
        Completed: {
          status: res["data"]["Completed"]["status"],
          count: res["data"]["Completed"]["count"]
            ? parseInt(res["data"]["Completed"]["count"])
            : 0,
        },
        Overdue: {
          status: res["data"]["Overdue"]["status"],
          count: res["data"]["Overdue"]["count"]
            ? parseInt(res["data"]["Overdue"]["count"])
            : 0,
        },
        Inprogress: {
          status: res["data"]["Inprogress"]["status"],
          count: res["data"]["Inprogress"]["count"]
            ? parseInt(res["data"]["Inprogress"]["count"])
            : 0,
        },
        Open: {
          status: res["data"]["Open"]["status"],
          count:
            res["data"]["Open"]["count"] || res["data"]["Inprogress"]["count"]
              ? (parseInt(res["data"]["Inprogress"]["count"]) ?? 0) +
                (parseInt(res["data"]["Open"]["count"]) ?? 0)
              : 0,
        },
      };
      const temp = {
        ...status,
        total:
          res["total"] && res["total"][0]["totaltasks"]
            ? parseInt(res["total"][0]["totaltasks"])
            : 0,
      };
      setTeamStatusInfo({
        ...temp,
      });
    });
    return () => {
      setMyStatusInfo(undefined);
      setTeamStatusInfo(undefined);
    };
  }, [RefreshToken]);

  useEffect(() => {
    if (CurrentTab === "MyTask" && myStatusInfo) {
      setStatusInfo(myStatusInfo);
    } else if (CurrentTab === "Teamtask" && teamStatusInfo) {
      setStatusInfo(teamStatusInfo);
    } else {
      setStatusInfo(undefined);
    }
  }, [CurrentTab, myStatusInfo, teamStatusInfo]);

  return (
    <RootPage sidebar="tasks">
      <Rolecheck module="Tasks" fullpage>
        <Drawer
          title={Title + " Task"}
          placement="right"
          onClose={onClose}
          visible={drawerVisible}
          width={isMobile ? "100%" : 600}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <TaskModifier
            onSubmit={OnSubmit}
            data={formData}
            btnloader={btnloader}
            onClose={onClose}
          />
        </Drawer>
        <Warpper>
          <div>
            <Row gutter={12} style={{ marginBottom: "3px" }}>
              <Col span={17} md={17} xs={24}>
                <h2>
                  <b>{"Tasks"}</b>
                </h2>
              </Col>
              <Col span={7} md={7} xs={24} style={{ marginTop: "6px" }}>
                <Radio.Group
                  onChange={event => OnTabChange(event.target.value)}
                  value={CurrentTab}
                >
                  <Radio value={"MyTask"}>My Task</Radio>
                  <Radio value={"Teamtask"}>My Team Task</Radio>
                </Radio.Group>
                <Button
                  style={{ float: "right" }}
                  onClick={OnNew}
                  type="primary"
                  size="small"
                >
                  New
                </Button>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={6} md={6} xs={24}>
                <PerformanceCard
                  color="#43a047"
                  title="Completed"
                  value={statusInfo?.["Completed"]["count"] ?? 0}
                  total={statusInfo?.["total"] ?? 0}
                  setStatus={setStatus}
                  status={status}
                />
              </Col>
              <Col span={6} md={6} xs={24}>
                <PerformanceCard
                  color="#ffa726"
                  title="Open"
                  value={statusInfo?.["Open"]["count"] ?? 0}
                  total={statusInfo?.["total"] ?? 0}
                  setStatus={setStatus}
                  status={status}
                />
              </Col>
              <Col span={6} md={6} xs={24}>
                <PerformanceCard
                  color="red"
                  title="Overdue"
                  value={statusInfo?.["Overdue"]["count"] ?? 0}
                  total={statusInfo?.["total"] ?? 0}
                  setStatus={setStatus}
                  status={status}
                />
              </Col>
              <Col span={6} md={6} xs={24}>
                <PerformanceCard
                  color="#585858"
                  title="Total"
                  value={statusInfo?.["total"] ?? 0}
                  total={statusInfo?.["total"] ?? 0}
                  setStatus={setStatus}
                  status={status}
                />
              </Col>
            </Row>
          </div>
          <br />
          <div className="clearfix" />

          {CurrentTab === "MyTask" && (
            <Row key={Key.my}>
              <Col span={24} md={24} xs={24}>
                <TaskTable
                  columns={columns}
                  entity="tasks/my-tasks"
                  primary="target_date"
                  refreshPage={RefreshToken}
                  pagination={true}
                  searchable={false}
                  status={status}
                />
              </Col>
            </Row>
          )}
          {state?.user?.is_manager && CurrentTab === "Teamtask" && (
            <Row key={Key.team}>
              <Col span={24} md={24} xs={24}>
                <TaskTable
                  columns={columns2}
                  entity="tasks/team"
                  primary="target_date"
                  pagination={true}
                  searchable={false}
                  refreshPage={RefreshToken}
                  status={status}
                />
              </Col>
            </Row>
          )}
        </Warpper>
      </Rolecheck>
    </RootPage>
  );
};

export default Tasks;
