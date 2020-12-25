import React, { useEffect } from "react";
import { Button, Col, Result, Row, Typography, notification } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

import HttpService from "../../services/httpService";

const { Paragraph } = Typography;
const ErrorPage = ({ componentStack, error }: any) => {
  useEffect(() => {
    document.getElementById("app-loader")?.remove();
  }, []);

  const navigator = window.navigator;
  const onSubmit = () => {
    const data = {
      subject: `Error: ${error.toString()}`,
      message: `${componentStack}
      Browser:${navigator?.appVersion}
      Browser Vendor:${navigator?.vendor}
      `,
    };
    HttpService.post("issues", data)
      .then(res => {
        notification.success({
          message: "Success",
          description: "Issue reported successfully",
        });
      })
      .catch(err => {
        notification.error({
          message: "Error",
          description: "Failed to report issue",
        });
      });
  };
  return (
    <Result
      status="error"
      title="Something Went Wrong"
      extra={
        <>
          <Row gutter={16} justify="center">
            <Col>
              <Button type="danger" onClick={onSubmit}>
                Report Issue
              </Button>
            </Col>
            <Col>
              <Button type="primary">
                <Link to="/">Back Home</Link>
              </Button>
            </Col>
          </Row>
        </>
      }
    >
      <div className="desc">
        {process.env.NODE_ENV !== "production" && (
          <>
            <Paragraph>
              <CloseCircleFilled style={{ color: "red" }} />
              &nbsp;
              <strong>Error:</strong> {error.toString()}
            </Paragraph>
            <Paragraph>
              <CloseCircleFilled style={{ color: "red" }} />
              &nbsp;
              <strong>Stacktrace:</strong>
              <pre> {componentStack}</pre>
            </Paragraph>
          </>
        )}
      </div>
    </Result>
  );
};

export default ErrorPage;
