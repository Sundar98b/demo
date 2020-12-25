import moment from "moment";
import React, { useState } from "react";
import { Badge, Button, Drawer, Tag, message, notification } from "antd";
import { CrownOutlined } from "@ant-design/icons";

import Actions from "../../components/actions";
import HttpService from "../../services/httpService";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import UserChip from "../../components/user-chip";
import UserModifier from "./user-modifier";
import TableComponent, { Columns } from "../../components/table-component";

const initialData = {
  first_name: null,
  last_name: null,
  mobile_number: null,
  email_id: null,
  employee_id: null,
  designation: null,
  department: null,
  team: null,
  line_manager: null,
  second_line_manager: null,
  work_location: null,
  cost_center: null,
  business_unit: null,
  date_of_birth: null,
  date_of_joining: null,
  gender: null,
  hr_manager: null,
  band: null,
  employee_status: null,
  username: null,
  password: null,
  roles: null,
  id: null,
  skip_approvals: false,
  is_ceo: false,
};

const Users: React.FC = () => {
  const [DrawerVisisble, setDrawerVisisble] = useState(false);
  const [formData, setformData] = useState(initialData);
  const [RefreshToken, setRefreshToken] = useState(0);
  const [Title, setTitle] = useState("New");
  const columns: Columns[] = [
    {
      name: "Emp ID",
      key: "employee_id",
      sortable: true,
      width: "120px",
    },
    {
      name: "Name",
      key: "display_name",
      render: (row: any) => {
        return (
          <>
            {row.is_ceo && (
              <Badge
                count={
                  <CrownOutlined rotate={45} style={{ color: "#EF9B0E" }} />
                }
              >
                <UserChip name={row.display_name} img={row.profile_photo} />
              </Badge>
            )}
            {!row.is_ceo && (
              <UserChip name={row.display_name} img={row.profile_photo} />
            )}
          </>
        );
      },
      sortable: true,
      width: "220px",
    },
    {
      name: "Department",
      key: "department_name",
      sortable: true,
      width: "120px",
    },
    {
      name: "Line Manager",
      key: "line_manager",
      sortable: true,
      width: "200px",
      render: (row: any) => {
        if (row.line_manager_name) {
          return (
            <UserChip name={row.line_manager_name} img={row.line_manager_pic} />
          );
        } else {
          return "";
        }
      },
    },
    {
      name: "Last Login",
      key: "last_login",
      sortable: true,
      width: "120px",
      render: (row: any) => {
        if (row.last_login) {
          return moment(row.last_login).fromNow();
        }
      },
    },
    {
      name: "Status",
      key: "employee_status",
      sortable: true,
      render: (row: any) => {
        if (row.employee_status === "Active") {
          return <Tag color="green">Active</Tag>;
        } else {
          return <Tag color="red">In Active</Tag>;
        }
      },
      width: "110px",
    },

    {
      name: "Actions",
      width: "100px",
      render: (row: any) => {
        return (
          <Actions
            module="Users"
            row={row}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      },
    },
  ];
  const onEdit = (row: any) => {
    setTitle("Edit");
    if (row.date_of_birth) {
      row.date_of_birth = moment(row.date_of_birth);
    }

    if (row.date_of_joining) {
      row.date_of_joining = moment(row.date_of_joining);
    }
    setformData(row);
    toggleDrawer();
  };

  const onDelete = (row: any) => {
    message.loading("Disabling");
    HttpService.delete("users", row.id).then(() => {
      setRefreshToken(RefreshToken + 2);
      message.destroy();
    });
  };

  const toggleDrawer = () => {
    setDrawerVisisble(!DrawerVisisble);
  };

  const onNew = () => {
    setTitle("New");
    setformData(initialData);
    toggleDrawer();
  };
  const onCancel = () => {
    toggleDrawer();
  };

  const onSubmit = (formData: any) => {
    if (formData.date_of_birth) {
      formData.date_of_birth = moment(formData.date_of_birth).format();
    }

    if (formData.date_of_joining) {
      formData.date_of_joining = moment(formData.date_of_joining).format();
    }
    const newRow = { ...initialData, ...formData };

    if (formData.id) {
      HttpService.put("users", newRow.id, newRow)
        .then(res => {
          notification.success({
            message: "Success",
            description: "User Updated successfully",
          });
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          notification.error({
            message: "Failed",
            description: "Update to add User",
          });
          setformData(newRow);
          setDrawerVisisble(true);
        })
        .finally(() => {});
    } else {
      HttpService.post("users", newRow)
        .then(res => {
          notification.success({
            message: "Success",
            description: "User added successfully",
          });
          toggleDrawer();
          setRefreshToken(RefreshToken + 1);
        })
        .catch(() => {
          notification.error({
            placement: "topLeft",
            message: "Error",
            description: "Unable to add User",
          });
          setformData(newRow);
          setDrawerVisisble(true);
        })
        .finally(() => {});
    }
  };

  return (
    <Rolecheck module="Users" fullpage>
      <TitleCard
        title={"Users"}
        extra={
          <Rolecheck module="Users" action="create">
            <Button type="primary" onClick={onNew} size="small">
              New
            </Button>
          </Rolecheck>
        }
      />
      <Drawer
        title={Title + " User"}
        visible={DrawerVisisble}
        width={900}
        onClose={toggleDrawer}
      >
        <UserModifier onSubmit={onSubmit} {...formData} onCancel={onCancel} />
      </Drawer>
      <TableComponent
        primary="display_name"
        columns={columns}
        entity="users"
        pagination={true}
        searchable={true}
        refreshPage={RefreshToken}
        searchArray={[
          "display_name",
          "department_name",
          "employee_id",
          "email_id",
        ]}
      />
    </Rolecheck>
  );
};

export default Users;
