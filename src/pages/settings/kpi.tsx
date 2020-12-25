import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import HttpService from "../../services/httpService";
import KPIModifier from "./kpi-modifier";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import TableComponent, { Columns } from "../../components/table-component";

interface kpiData {
  id: string;
  name: string;
  description: string;
  uom: string;
}

const initalData = {
  name: "",
  description: "",
  uom: "",
  id: "",
};
const KPI: React.FC = () => {
  const [drawerVisible, setdrawerVisible] = useState(false);
  const [formData, setFormData] = useState(initalData);
  const [refreshPage, setRefresh] = useState(0);
  const toggleDrawer = () => {
    setdrawerVisible(!drawerVisible);
  };

  const columns: Columns[] = [
    {
      name: "Name",
      key: "name",
      sortable: true,
      width: "230px",
    },
    {
      name: "Description",
      key: "description",
      sortable: true,
    },
    {
      name: "UOM",
      key: "uom_name",
      sortable: true,
    },
    {
      name: "Actions",
      sortable: false,
      width: "200px",
      render: (row: kpiData) => {
        return (
          <Actions row={row} module="KPI" onEdit={onEdit} onDelete={onDelete} />
        );
      },
    },
  ];
  const onNew = () => {
    toggleDrawer();
    setFormData(initalData);
  };

  const onCancel = () => {
    toggleDrawer();
  };

  const onEdit = (row: kpiData) => {
    toggleDrawer();
    setFormData(row);
  };

  const onDelete = (val: kpiData) => {
    message.loading("Disabling..", 0);
    HttpService.delete("kpi", val.id).then((res: any) => {
      setRefresh(refreshPage + 1);
      message.destroy();
    });
  };

  const onSubmit = (val: kpiData) => {
    if (val.id) {
      HttpService.put("kpi", val.id, val)
        .then((res: any) => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "KPI Updated Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Updating KPI",
          });
        });
    } else {
      HttpService.post("kpi", val)
        .then(res => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "KPI Added Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Adding KPI",
          });
        });
    }
  };

  return (
    <Rolecheck module="KPI" fullpage>
      <Drawer
        visible={drawerVisible}
        width={600}
        onClose={toggleDrawer}
        title="KPI"
        bodyStyle={{ paddingBottom: 80 }}
      >
        <KPIModifier
          {...formData}
          onSubmit={(value: any) => onSubmit(value)}
          onCancel={onCancel}
        />
      </Drawer>
      <TitleCard
        title="KPI"
        extra={
          <Rolecheck module="KPI" action="create">
            <Button type="primary" size="small" onClick={onNew}>
              New
            </Button>
          </Rolecheck>
        }
      />
      <TableComponent
        columns={columns}
        primary="name"
        entity="kpi"
        searchable={true}
        pagination={true}
        searchArray={["name", "description"]}
        refreshPage={refreshPage}
      />
    </Rolecheck>
  );
};

export default KPI;
