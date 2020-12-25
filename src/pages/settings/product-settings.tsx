import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row, Switch, message, notification } from "antd";
import { Link } from "react-router-dom";

import HttpService from "../../services/httpService";
import TitleCard from "../../components/title-card";

const Warpper = styled.div`
  .ant-card {
    margin-top: 6px;
  }
`;
const Card = styled.div`
  border: 1px solid rgb(235, 237, 240);
  padding: 0 12px;
  margin-bottom: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
`;
const Footer = styled.div`
  text-align: right;
  .ant-btn {
    margin-left: 2px;
  }
`;
const initialData = {
  Goals: false,
  Objective: false,
  "Key Results": false,
  Competence: false,
  "Performance Management": false,
  Discussions: false,
  "Chat Bot": true,
  Reports: false,
  Analytics: false,
  KPI: false,
  Feedback: false,
};

const ProductSettings: React.FC = () => {
  useEffect(() => {
    message.loading("Loading...");

    const id = (window as any).tenant_id || "";
    HttpService.get("product-settings/" + id)
      .then(res => {
        setData({ ...initialData, ...res.settings });
        setId(res.id);
      })
      .finally(() => {
        message.destroy();
      });
  }, []);

  const [Data, setData]: [any, any] = useState(initialData);
  const [Id, setId] = useState("");
  const onChange = (name: any, value: boolean) => {
    const newData = { ...Data };
    newData[name] = value;
    setData(newData);
  };

  const onSave = () => {
    message.loading("Updating ...");
    HttpService.put("product-settings", Id, { settings: Data })
      .then(() => {
        notification.success({
          message: "Product Settings updated sucessfully",
        });
        // window.location.reload();
      })
      .catch(() => {
        notification.error({
          message: "Problem while updating the Product Settings",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  return (
    <div>
      <TitleCard title="Product Settings" />
      <Warpper>
        {Object.keys(Data).map(item => (
          <Card key={item} hoverable>
            <Row>
              <Col span={8}>
                <h3>{item}</h3>
              </Col>
              <Col>
                &nbsp;&nbsp;&nbsp;
                <Switch
                  onChange={e => onChange(item, e)}
                  checkedChildren="Enable"
                  unCheckedChildren="Disabled"
                  checked={Data[item]}
                />
              </Col>
            </Row>
          </Card>
        ))}
      </Warpper>
      <Divider />

      <Footer>
        <Button>
          <Link to="/settings-product-settings"> Cancel</Link>
        </Button>
        &nbsp;
        <Button type="primary" onClick={onSave}>
          Save
        </Button>
      </Footer>
    </div>
  );
};

export default ProductSettings;
