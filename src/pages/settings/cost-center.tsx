import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import CostCenterModifier from "./cost-center-modifier";
import HttpService from "../../services/httpService";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import TableComponent, { Columns } from "../../components/table-component";

interface CostCenterDataType {
  id: string;
  name: string;
  description: string;
}

const initalData: CostCenterDataType = {
  id: "",
  name: "",
  description: "",
};

const Data: any[] = [];
const CostCenter: React.FC = () => {
  const [drawerVisible, setdrawerVisible] = useState(false);
  const [formData, setFormData] = useState(initalData);
  const [RefreshToken, setRefreshToken] = useState(0);

  const toggleDrawer = () => {
    setdrawerVisible(!drawerVisible);
  };

  const columns: Columns[] = [
    {
      name: "Name",
      key: "name",
      sortable: true,
      width: "270px",
    },
    {
      name: "Description",
      key: "description",
      sortable: true,
    },
    {
      name: "Actions",
      sortable: false,
      width: "200px",
      render: (row: any) => {
        return (
          <>
            <Actions
              onEdit={onEdit}
              row={row}
              onDelete={onDelete}
              module="Organization Setup"
            />
          </>
        );
      },
    },
  ];
  const onNew = () => {
    toggleDrawer();
    setFormData(initalData);
  };
  const onEdit = (row: any) => {
    toggleDrawer();
    setFormData(row);
  };
  const onCancel = () => {
    toggleDrawer();
  };
  const onDelete = (row: CostCenterDataType) => {
    message.loading("Disabling");
    HttpService.delete("cost-centers", row.id).then(() => {
      setRefreshToken(RefreshToken + 1);
      message.destroy();
    });
  };

  const onSubmit = (val: CostCenterDataType) => {
    if (val.id) {
      // update
      HttpService.put("cost-centers", val.id, val)
        .then(() => {
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while updating Cost Center",
          });
        });
    } else {
      // new
      HttpService.post("cost-centers", val)
        .then(() => {
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while adding Cost Center",
          });
        });
    }
  };
  return (
    <div>
      <Drawer
        visible={drawerVisible}
        width={600}
        onClose={toggleDrawer}
        title="Cost Center"
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CostCenterModifier
          {...formData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </Drawer>
      <TitleCard
        extra={
          <Rolecheck module="Organization Setup" action="create">
            <Button type="primary" size="small" onClick={onNew}>
              New
            </Button>
          </Rolecheck>
        }
      />
      <TableComponent
        data={Data}
        entity="cost-centers"
        columns={columns}
        primary="name"
        searchArray={["name", "description"]}
        pagination={true}
        searchable={true}
        refreshPage={RefreshToken}
      />
    </div>
  );
};

export default CostCenter;
