import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import BusinessUnitModifier from "./business-unit-modifier";
import HttpService from "../../services/httpService";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import TableComponent, { Columns } from "../../components/table-component";

interface unitData {
  id: string;
  name: string;
  description: string;
}

const initalData = {
  id: "",
  name: "",
  description: "",
};
const BusinessUnit: React.FC = () => {
  const [formData, setformData] = useState(initalData);
  const [drawerVisible, setdrawerVisible] = useState(false);
  const [Title, setTitle] = useState("New");
  const [refreshPage, setRefresh] = useState(0);

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
      render: (row: unitData) => {
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

  const OnNew = () => {
    setformData(initalData);
    setTitle("New");
    toggleDrawer();
  };

  const onCancel = () => {
    toggleDrawer();
  };
  const onEdit = (row: unitData) => {
    setformData(row);
    setTitle("Edit");
    toggleDrawer();
  };
  const onDelete = (val: unitData) => {
    const hide = message.loading("Deleting..", 0);
    HttpService.delete("business-units", val.id).then(res => {
      setRefresh(refreshPage + 1);
      setTimeout(hide, 1000);
    });
  };

  const onSubmit = (val: any) => {
    if (val.id) {
      HttpService.put("business-units", val.id, val)
        .then(() => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "Business Unit Updated Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Updating Business Unit",
          });
        });
    } else {
      HttpService.post("business-units", val)
        .then(() => {
          setRefresh(refreshPage + 1);
          toggleDrawer();
          notification.success({
            message: "Business Unit Added Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Adding Business Unit",
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
        title={Title + " Business Unit"}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <BusinessUnitModifier
          onSubmit={(value: any) => onSubmit(value)}
          {...formData}
          onCancel={onCancel}
        />
      </Drawer>
      <TitleCard
        extra={
          <Rolecheck module="Organization Setup" action="create">
            <Button type="primary" size="small" onClick={OnNew}>
              New
            </Button>
          </Rolecheck>
        }
      />
      <TableComponent
        columns={columns}
        primary="country"
        searchable={true}
        pagination={true}
        entity="business-units"
        searchArray={["name", "description"]}
        refreshPage={refreshPage}
      />
    </div>
  );
};

export default BusinessUnit;
