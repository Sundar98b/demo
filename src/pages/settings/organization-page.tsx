import styled from "styled-components";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { v4 } from "uuid";

import HttpService from "../../services/httpService";
import LazyImage from "../../components/lazy-img";
import TitleCard from "../../components/title-card";
import logoImg from "../../assets/logo-full.png";
import sector from "../../assets/sectors.json";

const { Option } = Select;
const { Item } = Form;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};
const ImageCont = styled.div`
  border-radius: 4px;
  padding: 5px;
  border: 1px dashed #ddd;
  margin: 3px;
  height: 110px;
  line-height: 110px;
  img {
    position: relative;
    top: 50%;
    transform: translateY(-10%);
    max-height: 96px !important;
    height: auto !important;
    max-width: 100%;
  }
`;
const UploadCont = styled.div`
  margin: 5px;
  padding: 5px;
`;
const FR = Fragment;
const OrganizationPage: React.FC = () => {
  const [uploadShow, setuploadShow] = useState(false);
  const [logo, setlogo] = useState(logoImg);
  const [PreviousLogo, setPreviousLogo] = useState("");
  const [submit, setSubmit] = useState(false);
  const toggleUpload = () => {
    setuploadShow(!uploadShow);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    const hide = message.loading("Loading.....");
    HttpService.get("organizations/mine").then((res: any) => {
      form.setFieldsValue(res);
      setlogo(res.logo);
      setPreviousLogo(res.logo);
      setTimeout(hide, 1000);
    });
  };

  const onSubmit = (data: any) => {
    setSubmit(true);
    HttpService.put("organizations", "mine", data).then(res => {
      setSubmit(false);
      if (res.data["logo"] !== PreviousLogo) {
        window.location.reload();
      }
    });
  };

  const onUpload = (e: any) => {
    if (e.file?.status === "done") {
      const url = e.file.response.url;
      form.setFieldsValue({
        logo: url,
      });
      setlogo(url);
      toggleUpload();
    }
  };

  return (
    <div>
      <TitleCard title="Organization Info" />
      <Row>
        <Col span={16}>
          <Form
            {...layout}
            form={form}
            layout="vertical"
            onFinish={data => onSubmit(data)}
          >
            <Item label="Name" name="name">
              <Input />
            </Item>
            <Item label="Description" name="description">
              <Input.TextArea />
            </Item>
            <Item label="Organization ID" name="id">
              <Input readOnly />
            </Item>
            <Row gutter={2}>
              <Col span={8}>
                <Item label="Sector" name="sector">
                  <Select showSearch>
                    {sector.objects.map(item => (
                      <FR key={v4()}>
                        {item.name && (
                          <Option value={item.name || ""}>{item.name}</Option>
                        )}
                      </FR>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col span={8}>
                <Item label="Address" name="line_2">
                  <Input.TextArea placeholder="Address" />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="ZIP Code" name="pincode">
                  <Input placeholder="pincode" />
                </Item>
              </Col>
            </Row>
            <Row gutter={2}>
              <Col span={8}>
                <Item label="City" name="city">
                  <Input placeholder="City" />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="Province" name="state">
                  <Input placeholder="State" />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="Country" name="country">
                  <Input placeholder="country" />
                </Item>
              </Col>
            </Row>
            <Row gutter={2}>
              <Col span={8}>
                <Item
                  label="E-Mail ID"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter the valid URL",
                    },
                  ]}
                >
                  <Input />
                </Item>
              </Col>
              <Col span={8}>
                <Item label="Phone No" name="phone">
                  <Input />
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  label="Website"
                  name="website"
                  rules={[
                    {
                      type: "url",
                      message: "Please enter the valid URL",
                    },
                  ]}
                >
                  <Input />
                </Item>
              </Col>
            </Row>
            <Item style={{ display: "none" }} name="logo">
              <Input />
            </Item>
            <Typography.Title level={4}>Logo</Typography.Title>
            <Row gutter={20}>
              {uploadShow && (
                <Col span={12}>
                  <UploadCont className="ant-upload ant-upload-drag">
                    <Upload
                      name="client_files"
                      action="/api/attachments"
                      onChange={onUpload}
                      accept="image/*"
                      headers={HttpService.getHeader()}
                      listType="picture"
                    >
                      <Button>
                        <UploadOutlined /> Click to upload
                      </Button>
                    </Upload>
                  </UploadCont>
                </Col>
              )}

              {!uploadShow && (
                <>
                  <Col span={12}>
                    <ImageCont>
                      <LazyImage
                        src={
                          logo ||
                          "https://datalligence.s3.ap-south-1.amazonaws.com/logo-full.png"
                        }
                        alt="Logo"
                      />
                    </ImageCont>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      This logo will appear on the Application, Reports and Mail
                      Content.
                      <small>
                        <br />
                        Preferred Image Size: 400px x 120px @ 72 DPI Maximum
                        size of 1MB.
                        <br />
                        <a
                          href="#remove-logo"
                          onClick={e => {
                            e.preventDefault();
                            toggleUpload();
                          }}
                        >
                          Change Logo
                        </a>
                      </small>
                    </Typography.Paragraph>
                  </Col>
                </>
              )}
            </Row>
            <div className="tr">
              <Button htmlType="reset">
                <Link to="/settings/organization-info">Cancel</Link>
              </Button>
              <Button
                htmlType="submit"
                style={{ marginLeft: 12 }}
                type="primary"
                loading={submit}
              >
                Save
              </Button>
              <Divider />
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default OrganizationPage;
