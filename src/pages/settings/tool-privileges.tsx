import styled from "styled-components";
import React, { useDebugValue, useEffect, useState } from "react";
import { Button, Drawer, Tabs, message, notification } from "antd";
import { v4 } from "uuid";

import HttpService from "../../services/httpService";
import RoleModifier from "./tool-privileges-modifier";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";

const { TabPane } = Tabs;
const Wrapper = styled.div`
  .ant-tabs {
    clear: both;
    top: -30px;
  }
`;
const RoleWrapper = styled.div`
  table {
    pointer-events: none;
  }
`;
export const defaultRoles = [
  {
    module: "Goals",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "disabled",
    checkin: "disabled",
    module_skip: false,
  },
  {
    module: "Objective",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "not-allowed",
    checkin: "disabled",
    module_skip: false,
  },

  {
    module: "Key Results",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "not-allowed",
    checkin: "not-allowed",
    module_skip: false,
  },
  {
    module: "Reports",
    view: "not-allowed",
    create: "disabled",
    edit: "disabled",
    delete: "disabled",
    close: "disabled",
    checkin: "disabled",
    module_skip: false,
  },
  {
    module: "Feedback",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "not-allowed",
    checkin: "disabled",
    module_skip: false,
  },
  {
    module: "User Profile",
    view: "not-allowed",
    create: "disabled",
    edit: "not-allowed",
    delete: "disabled",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
  {
    module: "Discussions",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "disabled",
    checkin: "disabled",
    module_skip: false,
  },
  {
    module: "Chat Bot",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "disabled",
    checkin: "disabled",
    module_skip: false,
  },
  {
    module: "Tasks",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "not-allowed",
    checkin: "disabled",
    module_skip: false,
  },

  {
    module: "Settings Menu",
    view: "not-allowed",
    create: "disabled",
    edit: "disabled",
    delete: "disabled",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
  {
    module: "Users",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
  {
    module: "Tool Privilege",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
  {
    module: "KPI",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "disabled",
    checkin: "disabled",
    module_skip: false,
  },
  {
    module: "Notification",
    view: "not-allowed",
    create: "disabled",
    edit: "disabled",
    delete: "disabled",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
  {
    module: "System Audit",
    view: "not-allowed",
    create: "disabled",
    edit: "disabled",
    delete: "disabled",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
  {
    module: "Data Import",
    view: "not-allowed",
    create: "disabled",
    edit: "disabled",
    delete: "disabled",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
  {
    module: "Organization Setup",
    view: "not-allowed",
    create: "not-allowed",
    edit: "not-allowed",
    delete: "not-allowed",
    close: "disabled",
    checkin: "disabled",
    module_skip: true,
  },
];
const intialValue = {
  name: "",
  role: defaultRoles,
};

const RolesAndPermission: React.FC = () => {
  const [visible, setDrawer] = useState(false);
  const [formData, setFormData] = useState(intialValue);
  const [RefreshToken, setRefreshToken] = useState(1);
  const [Data, setData] = useState([]);
  const [Title, setTitle] = useState("New");
  const [CurrentTab, setCurrentTab] = useState(0 + "");
  const [NewToken, setNewToken] = useState(0);
  const [isNewPage, setisNewPage] = useState(false);

  useDebugValue(isNewPage ? "New Page" : "Edit Page");
  const toggleDrawer = () => {
    setDrawer(!visible);
  };

  useEffect(() => {
    message.loading("Loading...");
    HttpService.get("roles/full").then(res => {
      setData(res.data);
      message.destroy();
    });
  }, [RefreshToken]);

  const onNew = () => {
    setisNewPage(true);
    setFormData(intialValue);
    setNewToken(NewToken + 1);
    toggleDrawer();
    setTitle("New");
  };

  const onCancel = () => {
    toggleDrawer();
  };

  const OnSubmit = (value: any) => {
    if (value.id) {
      HttpService.put("roles", value.id, value)
        .then(() => {
          setRefreshToken(RefreshToken + 1);
          notification.success({
            message: "Success",
            description: "Roles updated successfully",
          });
          setRefreshToken(RefreshToken + 1);
          toggleDrawer();
        })
        .catch(() => {
          notification.error({
            placement: "topLeft",
            message: "Error",
            description: "Problem while update role",
          });
          setFormData(value);
          setDrawer(true);
        })
        .finally(() => {});
    } else {
      HttpService.post("roles", value)
        .then(res => {
          setRefreshToken(RefreshToken + 1);
          notification.success({
            message: "Success",
            description: "Roles added successfully",
          });
          toggleDrawer();
        })
        .catch(() => {
          notification.error({
            placement: "topLeft",
            message: "Error",
            description: "Problem while adding role",
          });
        })
        .finally(() => {
          setisNewPage(false);
        });
    }
  };

  const onEdit = (row: any) => {
    setisNewPage(false);
    setFormData(row);
    toggleDrawer();
    setTitle("Edit");
  };
  const onDelete = (row: any) => {
    HttpService.delete("roles", row.id)
      .then(() => {
        notification.success({
          message: "Success",
          description: "Roles disabling successfully",
        });
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Problem while disabling the role",
        });
      })
      .finally(() => {
        setRefreshToken(RefreshToken + 1);
      });
  };
  const onCopy = (row: any) => {
    if (row.id) {
      delete row.id;
    }
    row.name = row.name + " copy";
    setisNewPage(false);
    setFormData(row);
    setTitle("Edit");
    toggleDrawer();
  };

  return (
    <Rolecheck module="Tool Privilege" fullpage>
      <Wrapper>
        <div className="clearfix" data-type={RefreshToken}>
          <TitleCard
            title="Tool Privileges"
            extra={
              <Rolecheck module="Tool Privilege" action="create">
                <Button type="primary" size="small" onClick={onNew}>
                  New
                </Button>
              </Rolecheck>
            }
          />
        </div>
        <Drawer
          title={Title + " Tool Privileges"}
          width={900}
          onClose={onCancel}
          visible={visible}
        >
          <RoleModifier
            isNew={isNewPage}
            onCancel={onCancel}
            onSubmit={(value: any) => OnSubmit(value)}
            formData={formData}
            mode="edit"
            token={NewToken}
            key={v4()}
          />
        </Drawer>
        <Tabs
          activeKey={CurrentTab}
          onChange={key => {
            setCurrentTab(key);
          }}
        >
          {Data.map((item: any, index) => (
            <TabPane tab={item.name} key={index + ""}>
              <RoleWrapper>
                <RoleModifier
                  mode="view"
                  formData={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onSubmit={() => null}
                  key={v4()}
                />
              </RoleWrapper>
            </TabPane>
          ))}
        </Tabs>
      </Wrapper>
    </Rolecheck>
  );
};

export default RolesAndPermission;
