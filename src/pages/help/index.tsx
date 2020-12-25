import React from "react";
import styled from "styled-components";
import { Button, Col, Divider, Form, Input, Row, notification } from "antd";

import HttpService from "../../services/httpService";
import Loader from "../../assets/loader-white.svg";
import RootPage from "../root";

const Iframe = styled.iframe`
  /* background: url(${Loader}) 0px 0px no-repeat; */
  width: 100%;
  background-size: 12%;
  min-height: 80vh;
  background-repeat: no-repeat;
  background-position: center;
  height: auto;
`;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const HelpPage: React.FC = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    HttpService.post("issues", values)
      .then(res => {
        notification.success({
          message: "Success",
          description: "Help submitted successfully",
        });
        form.resetFields();
      })
      .catch(err => {
        notification.error({
          message: "Error",
          description: "Failed to submit help",
        });
      });
  };
  return (
    <RootPage topbar="help">
      <div>
        <Row gutter={8}>
          <Col span={16} md={16} xs={24}>
            <Iframe
              width="100%"
              title="Help Docs"
              frameBorder="0"
              id="the-iframe"
              src="https://docs.google.com/document/d/e/2PACX-1vT0ZHjCrMcTeC2GQ77A4mvyxFalkti098HTQG-I4yvYV1IdXsFMMcEUSDglJk_hZwEGRQmU5n7UX8z_/pub?embedded=true"
            ></Iframe>
          </Col>
          <Col span={8} md={8} xs={24}>
            <h3>Contact us:</h3>
            <Divider />
            <Form layout="vertical" {...layout} form={form} onFinish={onFinish}>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[
                  { required: true, message: "please enter the subject" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Message" name="message">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </RootPage>
  );
};

export default HelpPage;
