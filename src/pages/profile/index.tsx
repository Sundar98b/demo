import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Tabs,
  Typography,
  Upload,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import LazyImage from "../../components/lazy-img";
import Rolecheck from "../../components/role-check";
import RootPage from "../root";
import UserChip from "../../components/user-chip";
import Utils from "../../utils";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};

const Email = styled.p`
  font-size: 11px;
`;
const LeftPane = styled.div`
  text-align: center;
  border-right: 1px solid #dedede;
  height: 80vh;
  padding-right: 3px;
  margin-right: 3px;
  padding-top: 8em;

  .ant-upload {
    position: relative;
    top: -19px;
  }

  .lazy-img {
    height: auto;
    width: auto;
    max-width: 200px;
    height: 200px;
    margin: 0 auto;
    border-radius: 3px;
  }
`;

const ReportingTo = styled.div`
  padding-left: 12px;
`;
const Padder = styled.div`
  padding: 12px;
`;

const Uploader = styled.div`
  .ant-upload {
    visibility: hidden;
    margin-bottom: -8px;
  }
  &:hover {
    .ant-upload {
      visibility: visible;
    }
  }
`;
const AvatarImg = styled(Avatar)`
  height: auto;
  width: 100%;
  max-width: 200px;
  height: 200px;
  background: #fd7f57;
  .ant-avatar-string {
    top: 50%;
    font-size: 70px;
    transform: translate(-50%, -50%) !important;
  }
`;
const Pane = Tabs.TabPane;
const { Item } = Form;

const ProfilePage: React.FC = () => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const user = state?.user;
  const [form] = Form.useForm();
  const [UserImage, setUserImage] = useState(AvatarImg);

  const onSubmit = (formData: any) => {
    const inputs = {
      old_password: formData.old_password,
      new_password: formData.new_password,
      repeat_password: formData.repeat_password,
    };

    HttpService.put("users/reset-password", "my", inputs)
      .then(res => {
        notification.success({
          message: "Success",
          description: "Password updated successfully",
        });
        window.sessionStorage.removeItem("x-token");
        window.location.href = "/login";
      })
      .catch(() => {
        notification.error({
          message: "Failed",
          description: "Password not updated",
        });
      });
  };
  useEffect(() => {
    if (user.last_login) {
      user.last_login = moment(user.last_login).format("LLL");
    }
    form.setFieldsValue(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const AvatarName = user.display_name?.charAt(0);
  const changePic = (formData: any) => {
    if (formData.id) {
      HttpService.put("users", formData.id, formData)
        .then(res => {
          notification.success({
            message: "Success",
            description: "Updated successfully",
          });
        })
        .catch(() => {
          notification.error({
            message: "Failed",
            description: "Failed to update",
          });
        });
    }
  };
  const onUpload = (e: any) => {
    if (e.file?.status === "done") {
      const id = e.file.response.url;
      form.setFieldsValue({
        profile_photo: id,
      });
      const updatedData = { ...user };
      updatedData.profile_photo = id;
      changePic(updatedData);
      setUserImage(id);
    }
  };
  return (
    <RootPage sidebar="profile">
      <Rolecheck module="User Profile" fullpage>
        <Row>
          <Col span={8} md={8} xs={24}>
            <LeftPane>
              <Uploader>
                {user.profile_photo && (
                  <LazyImage alt="Profile" src={user.profile_photo} />
                )}
                {!user.profile_photo && (
                  <div>
                    <AvatarImg shape="square" src={UserImage}>
                      {AvatarName}
                    </AvatarImg>
                  </div>
                )}
                <Rolecheck module="User Profile" hidden action="edit">
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
                </Rolecheck>
              </Uploader>
              <Typography.Title level={3}>{user.display_name}</Typography.Title>
              <p>{user.designation_name}</p>
              <Email>{user.email_id}</Email>
            </LeftPane>
          </Col>
          <Col span={16} md={16} xs={24}>
            <Tabs>
              <Pane key="Profile" tab="Profile">
                <Padder>
                  <Form form={form} {...layout} layout="vertical">
                    <Row gutter={2}>
                      <Col span={12}>
                        <Item label="First Name" name="first_name">
                          <Input disabled={true} placeholder="First name" />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label="Last Name" name="last_name">
                          <Input disabled={true} placeholder="Last Name" />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label="Email id" name="email_id">
                          <Input disabled={true} placeholder="Email" />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label="Employee id" name="employee_id">
                          <Input disabled={true} placeholder="Emp-ID" />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label="Department" name="department_name">
                          <Input disabled={true} placeholder="Department" />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label="Last Login" name="last_login">
                          <Input disabled={true} placeholder="Last Login" />
                        </Item>
                      </Col>
                    </Row>
                  </Form>
                </Padder>
                <Divider />
                <ReportingTo>
                  <Row>
                    <Col span={12}>
                      <h3>Line Manager</h3>
                      {user.line_manager_name && (
                        <UserChip
                          name={user.line_manager_name}
                          img={user.line_manager_pic}
                        />
                      )}
                    </Col>
                    <Col span={12}>
                      <h3>Secondary Line Manager</h3>
                      {user.line_manager_name && (
                        <UserChip
                          name={user.second_line_manager_name}
                          img={user.second_line_manager_pic}
                        />
                      )}
                    </Col>
                  </Row>
                </ReportingTo>
                <Divider />
              </Pane>
              <Pane key="Password" tab="Password">
                <Rolecheck module="User Profile" fullpage action="edit">
                  <Padder>
                    <Form
                      {...Utils.FormLayout}
                      form={form}
                      onFinish={value => {
                        onSubmit(value);
                      }}
                    >
                      <Form.Item
                        label="Old Password"
                        name="old_password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your old Password!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                        label="New Password"
                        name="new_password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your New Password!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                        label="Re-type Password"
                        name="repeat_password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Re-type Password!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <br />
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Reset Password
                        </Button>
                      </Form.Item>
                    </Form>
                  </Padder>
                </Rolecheck>
              </Pane>
            </Tabs>
          </Col>
        </Row>
      </Rolecheck>
    </RootPage>
  );
};

export default ProfilePage;
