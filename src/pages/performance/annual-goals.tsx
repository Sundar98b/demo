import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal, Tooltip, message, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import AnnualGoalModifier from "./annual-goals-modifier";
import Delete from "../../components/delete";
import Edit from "../../components/edit";
import HttpService from "../../services/httpService";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import Utils from "../../utils";
import TableComponent, { Columns } from "../../components/table-component";

const { confirm } = Modal;

const intialValue = {
  description: "",
  weightage: "",
  id: "",
};

const Scroller = styled.div`
  width: 100vw;
  overflow-x: auto;
  table {
    width: 91% !important;
    > thead > tr > th:nth-child(2) {
      padding: 0;
    }
    > thead > tr > th:nth-child(3) {
      padding: 0;
    }
  }
`;
const AnnualGoals: React.FC = () => {
  const location = useLocation();
  const [gotServerData, setgotServerData] = useState(false);
  const app_settings = useSelector(
    (store: any) => store.INITIAL_DATA.app_settings,
  );
  const [AllowNew, setAllowNew] = useState(false);
  const [overall, setoverall] = useState("0");
  const [performance, setperformance] = useState("0");
  const [Title, setTitle] = useState("New");
  const [formData, setFormData] = useState(intialValue);
  const [drawerVisiblity, setdrawerVisiblity] = useState(false);
  const [RefreshToken, setRefreshToken] = useState(0);
  const [Max, setMax] = useState(100);
  const [ORIMax, setORIMax] = useState(100);
  const state = useSelector((store: any) => store.INITIAL_DATA);

  const [isExpand, setisExpand] = useState(false);

  useEffect(() => {
    setisExpand(state.isExpand);
  }, [state]);

  const columns: Columns[] = [
    {
      name: "Goal Description",
      width: "300px",
      key: "description",
      render: (row: any) => {
        return (
          <div className="_250px">
            {isExpand && <div>{row.description}</div>}
            {!isExpand && (
              <Tooltip title={row.description}>
                <div className="truncate">{row.description}</div>
              </Tooltip>
            )}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Weightage",
      width: "100px",
      key: "weightage",
      sortable: true,
    },
    {
      name: "Performance",
      width: "100px",
      key: "performance",
      sortable: true,
      render: (row: any) => {
        return row.performance ? Utils.round(row.performance) : 0;
      },
    },
  ];

  app_settings?.settings?.cycles?.map((item: any, index: number) => {
    columns.push({
      name: item.name,
      sortable: true,
      width: "150px",
      key: "q" + (index + 1),
      render: (row: any) => {
        return row["q" + (index + 1)] ? Utils.round(row["q" + (index + 1)]) : 0;
      },
    });
  });

  columns.push({
    name: "Actions",
    width: "120px",
    render: (row: any) => {
      return (
        <>
          {row.can_edit && <Edit row={row} onEdit={onEdit} />}
          &nbsp;&nbsp;&nbsp;
          {row.can_delete && <Delete row={row} onDelete={onDelete} />}
        </>
      );
    },
  });
  const toggleDrawer = () => {
    setdrawerVisiblity(!drawerVisiblity);
  };

  const onEdit = (row: any) => {
    setTitle("Edit");
    setFormData(row);
    setMax(parseInt(overall, 10) - parseInt(row.weightage, 10));
    toggleDrawer();
  };

  const onDelete = (row: any) => {
    message.loading("Deleting...");
    HttpService.delete("/goals", row.id)
      .then(res => {
        setRefreshToken(RefreshToken + 1);
        notification.success({
          message: "Success",
          description: "Goal Deleted successfully",
        });
      })
      .catch(() => {
        notification.success({
          message: "Error",
          description: "Unable to Deleted the Goal",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  const onSubmit = (formData: any) => {
    if (formData.id) {
      HttpService.put("goals", formData.id, formData)
        .then(res => {
          setRefreshToken(RefreshToken + 1);

          notification.success({
            message: "Success",
            description: "Goal updated successfully",
          });
        })
        .catch(() => {
          notification.error({
            message: "Error",
            description: "Unable to update Goal",
          });
        })
        .finally(() => {
          toggleDrawer();
          setMax(ORIMax);
        });
    } else {
      HttpService.post("goals", formData)
        .then(res => {
          setRefreshToken(RefreshToken + 1);
        })
        .then(res => {
          notification.success({
            message: "Success",
            description: "Goal added successfully",
          });
        })
        .catch(() => {
          notification.error({
            message: "Error",
            description: "Unable to add Goal",
          });
        })
        .finally(() => {
          toggleDrawer();
        });
    }
  };
  const onNew = () => {
    if (AllowNew) {
      setTitle("New");
      setFormData(intialValue);
      toggleDrawer();
      setMax(parseInt(overall, 10));
    } else if (gotServerData) {
      confirm({
        title: "You already reach maximum goals this year",
        icon: <ExclamationCircleOutlined />,
        content:
          "Please contact Datalligence team, if you want to increase the goal limit",
        className: "logout-modal",
        okText: "Contact",
        onOk() {},
      });
    }
  };

  const onCancel = () => {
    toggleDrawer();
  };

  useEffect(() => {
    if (location.pathname.includes("/performance/goals/new")) {
      onNew();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Rolecheck module="Goals" fullpage>
      <TitleCard
        extra={
          <Button size="small" onClick={onNew} type="primary">
            New
          </Button>
        }
      />
      <Drawer
        width={600}
        title={Title + " Annual Goals"}
        visible={drawerVisiblity}
        onClose={toggleDrawer}
      >
        <AnnualGoalModifier
          onCancel={onCancel}
          max={Max}
          onSubmit={onSubmit}
          {...formData}
        />
      </Drawer>
      <Scroller>
        <div style={{ paddingRight: 30 }}>
          <TableComponent
            refreshPage={RefreshToken}
            columns={columns}
            entity="goals"
            onRender={(data: any) => {
              setgotServerData(true);
              setoverall(Utils.round(data?.meta?.weightage || "0"));
              setperformance(Utils.round(data?.meta?.performance || "0"));
              if (
                data?.meta?.total &&
                app_settings?.max_goal_per_year <= data.meta.total
              ) {
                setAllowNew(false);
              } else {
                setAllowNew(true);
              }
              if (data.meta && data.meta.sum) {
                setMax(data.meta.sum);
                setORIMax(data.meta.sum);
              } else {
                setMax(0);
              }
            }}
            footer={
              <tr>
                <th style={{ width: "200px" }}>Overall</th>
                <th style={{ width: "70px" }}>{overall}</th>
                <th style={{ width: "70px" }}>{performance}</th>
                <th colSpan={columns.length - 3}></th>
              </tr>
            }
          />
        </div>
      </Scroller>
    </Rolecheck>
  );
};

export default AnnualGoals;
