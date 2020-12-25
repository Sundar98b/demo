import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import HttpService from "../../services/httpService";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import UOMModifier from "./uom-modifier";
import TableComponent, { Columns } from "../../components/table-component";

interface UnitOfMeasurementsDataType {
  id: string;
  name: string;
  description: string;
}

const initalData: UnitOfMeasurementsDataType = {
  id: "",
  name: "",
  description: "",
};

const UnitOfMeasurements: React.FC = () => {
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
  const onDelete = (row: UnitOfMeasurementsDataType) => {
    message.loading("Disabling");
    HttpService.delete("unit-of-measurements", row.id).then(() => {
      setRefreshToken(RefreshToken + 1);
      message.destroy();
    });
  };

  const onSubmit = (val: UnitOfMeasurementsDataType) => {
    if (val.id) {
      // update
      HttpService.put("unit-of-measurements", val.id, val)
        .then(res => {
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while updating Unit of Measurements",
          });
        });
    } else {
      // new
      HttpService.post("unit-of-measurements", val)
        .then(() => {
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while updating Unit of Measurements",
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
        title="Unit of Measurements"
        bodyStyle={{ paddingBottom: 80 }}
      >
        <UOMModifier {...formData} onSubmit={onSubmit} onCancel={onCancel} />
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
        entity="unit-of-measurements"
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

export default UnitOfMeasurements;
