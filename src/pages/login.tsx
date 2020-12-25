import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, notification } from "antd";

import HttpService from "../services/httpService";
import Utils from "../utils";
import loginImage from "../assets/loginImage.jpg";

const Wrapper = styled.div`
  .login-page {
    //background-image: url(${loginImage});
    background-repeat: no-repeat;
    background-position: center;
    //background-size: 100%;
    background-size: cover;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }
`;
const LoginPage: React.FunctionComponent = () => {
  const [isLoading, setisLoading] = useState(false);
  const host = Utils.splitHostname();
  const FullLogo = "/api/login/logo/" + host.subdomain;

  useEffect(() => {
    document.getElementById("app-loader")?.remove();

    document.querySelector("body")?.classList.add("ovh");
    return () => {
      document.querySelector("body")?.classList.remove("ovh");
    };
  }, []);

  // useEffect(() => {
  //   if (window.location.search.includes("?err")) {
  //     notification.info({
  //       description: "Please login to continue",
  //       message: "Error",
  //       placement: "bottomLeft"
  //     });
  //   }
  // }, []);
  const doLogin = (val: any) => {
    setisLoading(true);
    HttpService.post("login", val)
      .then((res: any) => {
        window.sessionStorage.setItem("x-token", res.data.token);
        window.location.href = "/";
      })
      .catch(() => {
        notification.error({
          description: "Username or Password Invalid",
          message: "Oops❗️",
        });
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  return (
    <Wrapper>
      <div className="login-page">
        <Row
          style={{
            height: "95vh",
            width: "98vw",
            margin: "1%",
          }}
        >
          <Col
            style={{ height: "99%" }}
            lg={{ span: 6, offset: 1, push: 16 }}
            xs={{ span: 20, offset: 2 }}
          >
            <Row justify="space-around" style={{ height: "100%" }}>
              <Col span={24} style={{ height: "10%" }}></Col>
              <Col
                span={24}
                style={{
                  //border: '1px solid black',
                  height: "50%",
                }}
              >
                <Form onFinish={doLogin}>
                  <Form.Item>
                    <div className="cx-logo">
                      <img src={FullLogo} alt="Customer Logo" />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your username!",
                      },
                    ]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      loading={isLoading}
                      block
                      htmlType="submit"
                      style={{ background: "#850746" }}
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={24} style={{ height: "40%" }}>
                <div className="di-logo">
                  <p>Powered By</p>
                  <img
                    src={
                      "https://datalligence.s3.ap-south-1.amazonaws.com/logo-full.png"
                    }
                    alt="Customer Logo"
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            lg={{ span: 16, offset: 1, pull: 7 }}
            xs={{ span: 20, offset: 2 }}
            style={{
              height: "99%",
              textAlign: "center",
            }}
          >
            <Row style={{ height: "100%" }}>
              <Col span={24} className="login-slider" style={{ height: "85%" }}>
                <img src={loginImage} alt="Login Art" />
              </Col>
              <Col
                span={24}
                style={{
                  height: "15%",
                  fontSize: "18px",
                  color: "#000000",
                  paddingTop: "2rem",
                }}
              >
                <b>"Actions and data speak louder than words." - John Doerr</b>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Wrapper>
  );
};

export default LoginPage;
