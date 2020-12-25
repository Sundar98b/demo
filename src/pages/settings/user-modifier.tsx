import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/util";

import DefaultUserImage from "../../assets/user.svg";
import FormFooter from "../../components/form-footer";
import HttpService from "../../services/httpService";
import Select2 from "../../components/select2";
import { ModifierProps } from "../../utils/types";

const ImgWarpper = styled.div`
  text-align: right;
  position: relative;
  top: -5px;
  img {
    height: 75px;
    display: block;
    /* margin: 0 auto; */
    cursor: pointer;
    float: right;
    padding-right: 7px;
  }
`;

const Wrapper = styled.div``;
const { Item } = Form;
interface UserModifier extends ModifierProps {}

const UserModifier: React.FC<UserModifier> = props => {
  const [Loader, setLoader] = useState(false);
  const [ShowUploadBox, setShowUploadBox] = useState(false);
  const [UserImage, setUserImage] = useState(DefaultUserImage);
  const [ShowPassword, setShowPassword] = useState(false);
  const [form] = useForm();
  const showPic = () => {
    setShowUploadBox(true);
  };

  useEffect(() => {
    const formValues = { ...props };
    if (props.profile_photo) {
      setUserImage(props.profile_photo);
    } else {
      setUserImage(DefaultUserImage);
    }
    formValues.is_password_changed = 0;

    if (props.is_ceo) {
      formValues.skip_approvals = true;
    }

    form.setFieldsValue(formValues);

    setLoader(false);
    setShowUploadBox(false);
    setShowPassword(false);
  }, [form, props]);

  const onUpload = (e: any) => {
    if (e.file?.status === "done") {
      const id = e.file.response.url;
      form.setFieldsValue({
        profile_photo: id,
      });
      setUserImage(id);
      setShowUploadBox(false);
    }
  };

  return (
    <Wrapper>
      <Form
        form={form}
        layout="vertical"
        onFinish={value => {
          if (value.id && value.id === value.line_manager) {
            message.error("Please select different Line Manager");
            return false;
          }

          if (value.id && value.id === value.second_line_manager) {
            message.error("Please select different  Secondary Line Manager");
            return false;
          }

          props.onSubmit(value);
          setLoader(true);
        }}
      >
        <Row>
          <Col span={3}>
            <ImgWarpper>
              {ShowUploadBox && (
                <Upload
                  name="client_files"
                  action="/api/attachments"
                  onChange={onUpload}
                  accept="image/*"
                  headers={HttpService.getHeader()}
                >
                  <p>&nbsp;</p>
                  <Button>
                    <UploadOutlined /> Upload
                  </Button>
                </Upload>
              )}
              {!ShowUploadBox && (
                <Tooltip title="Click here to Change the Profile Pic">
                  <img
                    src={UserImage}
                    onClick={showPic}
                    alt="Profile Pic"
                    className="img img-res"
                  />
                </Tooltip>
              )}
            </ImgWarpper>
          </Col>
          <Col span={18}>
            <Row>
              <Col span={10}>
                <Item name="profile_photo" style={{ display: "none" }}>
                  <Input />
                </Item>
                <Item
                  name="first_name"
                  rules={[
                    { required: true, message: "Please enter the First Name" },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Item>
              </Col>
              <Col span={24} />
              <Col span={10}>
                <Item
                  name="last_name"
                  rules={[
                    { required: true, message: "Please enter the Last Name" },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Item>
                <Item name="id" style={{ display: "none" }}>
                  <Input />
                </Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={8}>
            <Item name="mobile_number" label="Mobile Number">
              <Input placeholder="Mobile Number" />
            </Item>
          </Col>
          <Col span={8}>
            <Item
              name="email_id"
              label="Email ID"
              rules={[
                {
                  type: "email",
                  message: "Please Enter the valid Email ID",
                },
              ]}
            >
              <Input placeholder="Email ID" />
            </Item>
          </Col>
          <Col span={8}>
            <Item name="employee_id" label="Employee ID">
              <Input placeholder="Employee ID" />
            </Item>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={8}>
            <Item name="designation" label="Designation">
              <Select2 entity="designation" />
            </Item>
          </Col>
          <Col span={8}>
            <Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Department is required" }]}
            >
              <Select2 entity="departments" />
            </Item>
          </Col>
          <Col span={8}>
            <Item name="team" label="Team/Sub-Department">
              <Input />
            </Item>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={8}>
            <Item
              name="line_manager"
              label="Line Manager"
              style={{
                opacity: props.is_ceo ? ".5" : "1",
                pointerEvents: props.is_ceo ? "none" : "auto",
              }}
              rules={[
                {
                  required: props.is_ceo ? false : true,
                  message: "Line Manager is required",
                },
              ]}
            >
              <Select2
                entity="users"
                entity_search={["display_name", "email", "username"]}
                entity_id="display_name"
              />
            </Item>
          </Col>
          <Col span={8}>
            <Item
              name="second_line_manager"
              label="Secondary line manager"
              style={{
                opacity: props.is_ceo ? ".5" : "1",
                pointerEvents: props.is_ceo ? "none" : "auto",
              }}
            >
              <Select2 entity="users" entity_id="display_name" />
            </Item>
          </Col>

          <Col span={8}>
            <Item name="work_location" label="Work Location">
              <Select2 entity="locations" entity_id="identification_name" />
            </Item>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={8}>
            <Item name="cost_center" label="Cost Center">
              <Select2 entity="cost-centers" />
            </Item>
          </Col>
          <Col span={8}>
            <Item name="business_unit" label="Business Unit">
              <Select2 entity="business-units" />
            </Item>
          </Col>
          <Col span={8}>
            <Item name="date_of_birth" label="Date Of Birth">
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={current => {
                  return current > moment();
                }}
                format="DD-MMM-YYYY"
              />
            </Item>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={8}>
            <Item name="date_of_joining" label="Date Of Joining">
              <DatePicker style={{ width: "100%" }} format="DD-MMM-YYYY" />
            </Item>
          </Col>

          <Col span={8}>
            <Item name="gender" label="Gender">
              <Select>
                <Select.Option value="fe-male">Female</Select.Option>
                <Select.Option value="male">Male</Select.Option>
              </Select>
            </Item>
          </Col>
          <Col span={8}>
            <Item name="hr_manager" label="HR Manager">
              <Select2 entity="users" entity_id="display_name" />
            </Item>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={8}>
            <Item name="band" label="Band">
              <Select2 entity="bands" />
            </Item>
          </Col>

          <Col span={8}>
            <Item
              name="employee_status"
              label="Employee Status"
              rules={[
                {
                  required: true,
                  message: "Please select the Employee Status",
                },
              ]}
            >
              <Select2
                options={[
                  {
                    name: "Active",
                    value: "Active",
                  },
                  {
                    name: "Inactive",
                    value: "Inactive",
                  },
                ]}
              />
            </Item>
          </Col>
          <Col span={8}>
            <Item name="user_role" label="Role">
              <Select2 entity="userroles" />
            </Item>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={8}>
            <Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter the username",
                },
              ]}
            >
              <Input placeholder="Username" />
            </Item>
          </Col>

          <Col span={8}>
            <Item name="is_password_changed" style={{ display: "none" }}>
              <Input />
            </Item>
            <Item
              style={{
                display:
                  !props.id || (props.id && ShowPassword) ? "block" : "none",
              }}
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter the password",
                },
              ]}
            >
              <Input.Password
                onChange={() => {
                  const value = form.getFieldsValue();
                  value.is_password_changed = 1;
                  form.setFieldsValue(value);
                }}
                placeholder="Password"
              />
            </Item>
            {props.id && !ShowPassword && (
              <Item label="Password">
                <Button
                  onClick={() => {
                    form.setFieldsValue({
                      password: "",
                    });
                    setShowPassword(true);
                  }}
                >
                  Change Password
                </Button>
              </Item>
            )}
          </Col>
          <Col span={8}>
            <Item
              name="roles"
              rules={[
                {
                  required: true,
                  message: 'Please select the "Tool Privilege"',
                },
              ]}
              label="Tool Privilege"
            >
              <Select2 entity="roles" />
            </Item>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={8}>
            <Item
              name="skip_approvals"
              label="Skip Approvals"
              valuePropName="checked"
            >
              <Checkbox disabled={props.is_ceo} />
            </Item>
          </Col>
        </Row>
        <FormFooter>
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button htmlType="submit" loading={Loader} type="primary">
            Submit
          </Button>
        </FormFooter>
      </Form>
    </Wrapper>
  );
};
UserModifier.defaultProps = {
  submitBtn: true,
  loginDetails: true,
  readOnly: false,
};

export default UserModifier;
