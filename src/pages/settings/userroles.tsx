import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import HttpService from "../../services/httpService";
import RoleModifier from "./roles-modifier";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import TableComponent, { Columns } from "../../components/table-component";

interface RoleData {
  id: string;
  name: string;
  description: string;
}

const initalData = {
  id: "",
  name: "",
  description: "",
};
const Roles: React.FC = () => {
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
      name: "Actions",
      sortable: false,
      width: "200px",
      render: (row: RoleData) => {
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

  const onCancel = () => {
    toggleDrawer();
  };

  const onEdit = (row: RoleData) => {
    toggleDrawer();
    setFormData(row);
  };

  const onDelete = (val: RoleData) => {
    message.loading("Disabling..", 0);
    HttpService.delete("userroles", val.id).then((res: any) => {
      setRefresh(refreshPage + 1);
      message.destroy();
    });
  };

  const onSubmit = (val: RoleData) => {
    if (val.id) {
      HttpService.put("userroles", val.id, val)
        .then((res: any) => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "Role Updated Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Updating Band",
          });
        });
    } else {
      HttpService.post("userroles", val)
        .then(res => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "Role Added Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Adding Band",
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
        title="Role"
        bodyStyle={{ paddingBottom: 80 }}
      >
        <RoleModifier
          {...formData}
          onSubmit={(value: any) => onSubmit(value)}
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
        columns={columns}
        primary="country"
        entity="userroles"
        searchable={true}
        pagination={true}
        searchArray={["name"]}
        refreshPage={refreshPage}
      />
    </div>
  );
};

export default Roles;
