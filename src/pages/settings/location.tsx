import React, { useState } from "react";
import { Button, Drawer, message, notification } from "antd";

import Actions from "../../components/actions";
import HttpService from "../../services/httpService";
import LocationModifier from "./location-modifier";
import Rolecheck from "../../components/role-check";
import TableComponent from "../../components/table-component";
import TitleCard from "../../components/title-card";

interface locationData {
  id: string;
  city: string;
  state: string;
  identification_name: string;
  line_1: string;
  line_2: string;
  pincode: string;
  country: string;
}
const EmptyData = {
  id: "",
  city: "",
  state: "",
  identification_name: "",
  line_1: "",
  line_2: "",
  pincode: "",
  country: "",
};
const Location: React.FC = () => {
  const [drawerVisible, setdrawerVisible] = useState(false);
  const [formData, setformData] = useState(EmptyData);
  const [Title, setTitle] = useState("New");
  const [refreshPage, setRefresh] = useState(0);
  const toggleDrawer = () => {
    setdrawerVisible(!drawerVisible);
  };

  const OnEdit = (row: locationData) => {
    setformData(row);
    setTitle("Edit");
    toggleDrawer();
  };

  const OnDelete = (row: locationData) => {
    const hide = message.loading("Deleting..", 0);
    HttpService.delete("locations", row.id).then(res => {
      setRefresh(refreshPage + 1);
      setTimeout(hide, 1000);
    });
  };

  const columns = [
    {
      name: "Location Name",
      key: "identification_name",
      sortable: true,
      width: "270px",
    },
    {
      name: "City",
      key: "city",
      sortable: true,
    },
    {
      name: "Province",
      key: "state",
      sortable: true,
    },
    {
      name: "Country",
      key: "country",
      sortable: true,
    },
    {
      name: "Actions",
      width: "200px",
      render: (row: locationData) => (
        <Actions
          onEdit={OnEdit}
          row={row}
          onDelete={OnDelete}
          module="Organization Setup"
        />
      ),
    },
  ];

  const OnNew = () => {
    setformData(EmptyData);
    setTitle("New");
    toggleDrawer();
  };

  const onCancel = () => {
    toggleDrawer();
  };

  const OnSubmit = (row: locationData) => {
    if (row.id) {
      HttpService.put("locations", row.id, row)
        .then((res: any) => {
          setRefresh(refreshPage + 1);

          toggleDrawer();
          notification.success({
            message: "Location Updated Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Updating Location",
          });
        });
    } else {
      HttpService.post("locations", row)
        .then(res => {
          setRefresh(refreshPage + 1);

          toggleDrawer();
          notification.success({
            message: "Location Added Successfully",
          });
        })
        .catch(() => {
          toggleDrawer();
          notification.error({
            message: "Error while Adding Location",
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
        title={Title + " Location"}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <LocationModifier
          onSubmit={(value: any) => OnSubmit(value)}
          {...formData}
          onCancel={onCancel}
        />
      </Drawer>
      <TitleCard
        title=""
        extra={
          <Rolecheck module="Organization Setup" action="create">
            <Button type="primary" size="small" onClick={OnNew}>
              New
            </Button>
          </Rolecheck>
        }
      />
      <TableComponent
        data={[]}
        columns={columns}
        primary="country"
        searchable={true}
        pagination={true}
        entity="locations"
        searchArray={["identification_name"]}
        refreshPage={refreshPage}
      />
    </div>
  );
};

export default Location;
