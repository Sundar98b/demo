import React, { useEffect } from "react";
import { Button, Result } from "antd";

const SubDomainErrorPage: React.FC = () => {
  useEffect(() => {
    document.getElementById("app-loader")?.remove();
  }, []);
  return (
    <Result
      status="error"
      title={"We couldn't find  " + window.location.hostname}
      extra={[
        <Button
          type="primary"
          key="console"
          onClick={() => {
            window.location.href = "https://datalligence.ai/";
          }}
        >
          Go to Home
        </Button>,
        <Button
          key="reload"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Reload Page
        </Button>,
      ]}
    ></Result>
  );
};

export default SubDomainErrorPage;
