import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Radio } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/util";
import { useSelector } from "react-redux";

import FormFooter from "../../components/form-footer";
import Rolecheck from "../../components/role-check";
import { ModifierProps } from "../../utils/types";
import { defaultRoles } from "./tool-privileges";

interface RoleModifierProps extends ModifierProps {
  mode: string;
  token?: number;
  isNew?: boolean;
}
const { confirm } = Modal;
const { Item } = Form;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border: 1px solid #d3d3d3;
  thead {
    background: #eee;
  }
  tbody tr {
    border-bottom: 1px solid #e6eaed;
  }
  td,
  th {
    padding: 10px 10px 10px 5px;
  }
`;
const RightDiv = styled.div`
  float: right;
`;

const RoleModifier: React.FC<RoleModifierProps> = props => {
  const [form] = useForm();
  const [rolesData, setRolesData] = useState(props.formData.role);
  const [formData, setFormData] = useState({});
  const store = useSelector((store: any) => store.INITIAL_DATA);

  const EnabledModules = store?.product_settings?.settings;

  useEffect(() => {
    let _defaultRoles = [...defaultRoles];
    const _propsRoles = [...props.formData.role];
    if (props.isNew) {
      _defaultRoles = _defaultRoles.map((item: any) => {
        Object.keys(item).forEach((role: any) => {
          if (item[role] === "allowed") {
            item[role] = "not-allowed";
          }
        });
        return item;
      });
    }
    const newRolles = Object.assign(_defaultRoles, _propsRoles);
    setRolesData(newRolles);
    form.setFieldsValue(props.formData);
  }, [form, props]);

  const onChange = (e: any) => {
    switch (e.target.value) {
      case "edit":
        props.onEdit(props.formData);
        break;
      case "copy":
        props.onCopy(props.formData);
        break;
      case "delete":
        confirm({
          title: "Are you sure to disable the role?",
          icon: <ExclamationCircleOutlined />,
          okText: "Yes",
          okType: "danger",
          content: "This action cannot be undone",
          onOk() {
            props.onDelete(props.formData);
          },
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (e: any, index: number, key: string) => {
    let newArr = [...rolesData];
    //@ts-ignore
    newArr[index][key] = e === "not-allowed" ? "allowed" : "not-allowed";
    setRolesData(newArr);
    const obj = { ...formData, role: newArr };
    setFormData(obj);
  };

  const hasModule = (item: any) => {
    return !!(EnabledModules[item.module] || item.module_skip);
  };

  return (
    <div>
      <Form
        key={props.token + "" || 100 + ""}
        form={form}
        layout="vertical"
        wrapperCol={{ span: 24 }}
        onFinish={val => {
          const newRole = {
            role: props.formData.role,
          };
          props.onSubmit({ ...newRole, ...formData, ...val });
        }}
      >
        {props.mode === "edit" && (
          <>
            <Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the Name of role",
                },
              ]}
            >
              <Input style={{ maxWidth: 300 }} />
            </Item>
            <Item name="id" style={{ display: "none" }} label="ID">
              <Input />
            </Item>
          </>
        )}
        <RightDiv>
          <Radio.Group onChange={onChange} value={"d"} size="small">
            {props.mode === "view" && (
              <>
                {!props.formData.is_default && (
                  <>
                    <Rolecheck module="Tool Privilege" action="create">
                      <Radio.Button value="copy">Copy</Radio.Button>
                    </Rolecheck>
                    <Rolecheck module="Tool Privilege" action="edit">
                      <Radio.Button value="edit">Edit</Radio.Button>
                    </Rolecheck>
                    <Rolecheck module="Tool Privilege" action="delete">
                      <Radio.Button value="delete">Delete</Radio.Button>
                    </Rolecheck>
                  </>
                )}
              </>
            )}
          </Radio.Group>
        </RightDiv>
        <Table>
          <thead>
            <tr>
              <th>Module</th>
              <th>View</th>
              <th>Create</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Close</th>
              <th>Check In</th>
            </tr>
          </thead>
          <tbody>
            {rolesData.map(
              (item: any, index: any) =>
                hasModule(item) && (
                  <tr key={item.module}>
                    <td style={{ width: 300 }}>{item.module}</td>
                    <td>
                      {item.view === "disabled" ? (
                        ""
                      ) : (
                        <Checkbox
                          checked={item.view === "allowed" ? true : false}
                          onChange={() =>
                            handleChange(item.view, index, "view")
                          }
                        />
                      )}
                    </td>
                    <td>
                      {item.create === "disabled" ? (
                        ""
                      ) : (
                        <Checkbox
                          checked={item.create === "allowed" ? true : false}
                          onChange={() =>
                            handleChange(item.create, index, "create")
                          }
                        />
                      )}
                    </td>
                    <td>
                      {item.edit === "disabled" ? (
                        ""
                      ) : (
                        <Checkbox
                          checked={item.edit === "allowed" ? true : false}
                          onChange={() =>
                            handleChange(item.edit, index, "edit")
                          }
                        />
                      )}
                    </td>
                    <td>
                      {item.delete === "disabled" ? (
                        ""
                      ) : (
                        <Checkbox
                          checked={item.delete === "allowed" ? true : false}
                          onChange={() =>
                            handleChange(item.delete, index, "delete")
                          }
                        />
                      )}
                    </td>
                    <td>
                      {item.close === "disabled" ? (
                        ""
                      ) : (
                        <Checkbox
                          checked={item.close === "allowed" ? true : false}
                          onChange={() =>
                            handleChange(item.close, index, "close")
                          }
                        />
                      )}
                    </td>
                    <td>
                      {item.checkin === "disabled" ? (
                        ""
                      ) : (
                        <Checkbox
                          checked={item.checkin === "allowed" ? true : false}
                          onChange={() =>
                            handleChange(item.checkin, index, "checkin")
                          }
                        />
                      )}
                    </td>
                  </tr>
                ),
            )}
          </tbody>
        </Table>
        {props.mode === "edit" && (
          <FormFooter>
            <Button onClick={props.onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FormFooter>
        )}
      </Form>
    </div>
  );
};
RoleModifier.defaultProps = {
  isNew: false,
};
export default RoleModifier;
