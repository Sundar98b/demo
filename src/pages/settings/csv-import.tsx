import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  CloseCircleOutlined,
  CloudSyncOutlined,
  InboxOutlined,
  SmileOutlined,
  SolutionOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Result, Steps, Typography, Upload } from "antd";

import HttpService from "../../services/httpService";

const { Step } = Steps;
const Warpper = styled.div`
  height: 300px;
  width: 600px;
`;
const { Dragger } = Upload;
const { Paragraph, Text } = Typography;
interface CsvImport {
  module: string;
}

const TaskColumn: any = {
  name: "Description",
  assign_to: "Assign To",
  target_date: "Target Date",
  priority: "Priority",
  recurrence: "No. of Occurrences",
};

const DraggerWrapper = styled.div`
  width: 600px;
  margin: 0 auto;
  left: 62%;
  top: 65px;
  transform: translateX(-50%);
  position: relative;
`;

const Wrapper = styled.div`
  margin: 0 auto;
  width: 765px;
`;

const CsvImport: React.FC<CsvImport> = props => {
  const [CurrentStep, setCurrentStep] = useState(0);
  const [Module, setModule] = useState("");
  const [MannualErrorBean, setMannualErrorBean] = useState("");
  const [Joi, setJoi] = useState([]);
  useEffect(() => {
    setCurrentStep(0);
  }, []);
  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };
  useEffect(() => {
    setModule(props.module);
  }, [props.module]);

  const onUpload = (e: any) => {
    if (e.file?.status === "done") {
      setCurrentStep(3);
    }
    if (e.file?.status === "error") {
      setCurrentStep(2);
      const res = e.file.response;
      if (res && res.error) {
        setMannualErrorBean(res.error);
      }
      if (res?.details) {
        setJoi(res.details);
        setMannualErrorBean("&nbsp;");
      }
    }
  };

  return (
    <Warpper>
      <div>
        <div>
          <Steps onChange={onStepChange} current={CurrentStep}>
            <Step title="Upload" icon={<UploadOutlined />} />
            <Step title="Verification" icon={<SolutionOutlined />} />
            <Step title="Processing" icon={<CloudSyncOutlined />} />
            <Step title="Done" icon={<SmileOutlined />} />
          </Steps>
        </div>

        <div>
          {CurrentStep === 0 && (
            <>
              <DraggerWrapper>
                <Dragger
                  name="client_files"
                  action={"/api/import-csv/" + Module.toLowerCase()}
                  onChange={onUpload}
                  accept=".csv"
                  headers={HttpService.getHeader()}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Please add the CSV with the header
                  </p>
                </Dragger>
              </DraggerWrapper>
            </>
          )}
          {CurrentStep === 1 && (
            <Wrapper>
              <Result status="info" title="Verify the Imported CSV" />
            </Wrapper>
          )}
          {CurrentStep === 2 && (
            <Wrapper>
              {MannualErrorBean && (
                <Result
                  status="error"
                  title="Submission Failed"
                  subTitle="Please check and modify the following information before resubmitting."
                >
                  <div className="desc">
                    <Paragraph>
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                        }}
                      >
                        The content you submitted has the following error:
                      </Text>
                    </Paragraph>
                    {MannualErrorBean !== "&nbsp;" && (
                      <Paragraph>
                        <CloseCircleOutlined className="site-result-demo-error-icon" />
                        &nbsp;&nbsp;
                        {MannualErrorBean}
                      </Paragraph>
                    )}
                    {Joi.map((res: any, index) => (
                      <Paragraph>
                        <CloseCircleOutlined className="site-result-demo-error-icon" />
                        &nbsp;&nbsp; <strong>Row :</strong> {index + 1},
                        <strong> Column:</strong> {TaskColumn[res.context.key]}{" "}
                        <br />
                        <strong>Trace :</strong>
                        {res.message}
                      </Paragraph>
                    ))}
                  </div>
                </Result>
              )}
            </Wrapper>
          )}
          {CurrentStep === 3 && (
            <Wrapper>
              <Result status="success" title="Data imported successfully" />
            </Wrapper>
          )}
        </div>
      </div>
    </Warpper>
  );
};

export default CsvImport;
