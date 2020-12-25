import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import BandModifier from "./band-modifier";
import HttpService from "../../services/httpService";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import TableComponent, { Columns } from "../../components/table-component";

interface bandData {
  id: string;
  name: string;
  description: string;
}

const initalData = {
  id: "",
  name: "",
  description: "",
};
const Band: React.FC = () => {
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
      render: (row: bandData) => {
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

  const onEdit = (row: bandData) => {
    toggleDrawer();
    setFormData(row);
  };

  const onDelete = (val: bandData) => {
    message.loading("Disabling..", 0);
    HttpService.delete("bands", val.id).then((res: any) => {
      setRefresh(refreshPage + 1);
      message.destroy();
    });
  };

  const onSubmit = (val: bandData) => {
    if (val.id) {
      HttpService.put("bands", val.id, val)
        .then((res: any) => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "Band Updated Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Updating Band",
          });
        });
    } else {
      HttpService.post("bands", val)
        .then(res => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "Band Added Successfully",
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
        title="Band"
        bodyStyle={{ paddingBottom: 80 }}
      >
        <BandModifier
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
        entity="bands"
        searchable={true}
        pagination={true}
        searchArray={["name"]}
        refreshPage={refreshPage}
      />
    </div>
  );
};

export default Band;
