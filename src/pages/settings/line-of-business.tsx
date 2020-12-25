import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import HttpService from "../../services/httpService";
import LineOfBusinessModifier from "./line-of-business-modifier";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import TableComponent, { Columns } from "../../components/table-component";

interface LineOfBusinessDataType {
  id: string;
  name: string;
  description: string;
}

const initalData: LineOfBusinessDataType = {
  id: "",
  name: "",
  description: "",
};

const Data: any[] = [];
const LineOfBusiness: React.FC = () => {
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
  const onDelete = (row: LineOfBusinessDataType) => {
    message.loading("Disabling");
    HttpService.delete("line-of-business", row.id)
      .then(() => {
        setRefreshToken(RefreshToken + 1);
        message.destroy();
      })
      .catch(() => {
        message.destroy();
        notification.error({
          message: "Error while updating Line Of Business",
        });
      });
  };

  const onSubmit = (val: LineOfBusinessDataType) => {
    if (val.id) {
      // update
      HttpService.put("line-of-business", val.id, val)
        .then(() => {
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while updating Line Of Business",
          });
        });
    } else {
      // new
      HttpService.post("line-of-business", val)
        .then(() => {
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while updating Line Of Business",
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
        title="Line Of Business"
        bodyStyle={{ paddingBottom: 80 }}
      >
        <LineOfBusinessModifier
          {...formData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </Drawer>
      <TitleCard
        title=""
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
        entity="line-of-business"
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

export default LineOfBusiness;
