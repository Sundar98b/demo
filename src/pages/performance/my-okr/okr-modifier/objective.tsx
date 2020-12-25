import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from "antd";

import HttpService from "../../../../services/httpService";
import Select2 from "../../../../components/select2";
import UserChip from "../../../../components/user-chip";
import Utils from "../../../../utils";
import { ModifierProps } from "../../../../utils/types";

const { xs } = Utils.MediaQuery;
interface Objective extends ModifierProps {
  onSubmit: Function;
  fromDate: string;
  toDate: string;
  objectiveType: string;
  assignRule: string;
  user_id: string;
  user_name: string;
  from_admin: boolean;
  objData?: any;
}
const { Item } = Form;
const { Option } = Select;
const Wrapper = styled.div`
  .card {
    width: 80%;
    min-height: 200px;
    border: 1px solid #707070;
    background: #fff;
    padding: 20px;
    margin: 0 auto;
    ${xs} {
      width: 90%;
    }
  }

  .btn {
    margin-top: 10px;
  }

  .rowStyle {
    margin-top: 20px;
  }
`;
export const Footer = styled.div`
  position: absolute;
  z-index: 12;
  right: 7px;
  bottom: 10px;
  .ant-btn {
    margin-left: 12px;
  }
`;

const Objective: React.FC<Objective> = props => {
  const conditions: any = {
    own: {
      shared: false,
      disabled: true,
      assign: false,
    },
    cross_team: {
      shared: true,
      disabled: true,
      assign: true,
    },
    team: {
      shared: true,
      disabled: true,
      assign: true,
    },
    org: {
      shared: true,
      disabled: false,
      assign: true,
    },
  };

  const [measure, setMeasureSwitch] = useState(false);
  const [Status, setStatus] = useState("");
  const [form] = Form.useForm();
  const [AssignToEndPoints, setAssignToEndPoints] = useState("users");
  const [isShared, setisShared] = useState(false);
  const [isMaxObjExceeded, setMaxObjExceeded] = useState(false);
  const [userObjEligibily, setUserObjEligibily] = useState<[]>([]);
  useEffect(() => {
    setisShared(!!conditions[props.objectiveType]["shared"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (props.assignRule !== "private") {
      setAssignToEndPoints("users");
    } else {
      if (
        props.objectiveType === "team" ||
        props.objectiveType === "organization"
      ) {
        setAssignToEndPoints("users/direct-reportees");
      } else if (props.objectiveType === "cross_team") {
        setAssignToEndPoints("users/secondary-reportees");
      }
    }
  }, [props.assignRule, props.objectiveType]);

  useEffect(() => {
    const value = { ...props };
    if (props.objectiveType === "own") {
      value.shared = false;
    } else {
      value.shared = true;
    }

    form.setFieldsValue({ value });
  }, [form, props]);

  const toggleSwitch = () => {
    setisShared(!isShared);
  };

  const measureSwitch = () => {
    setMeasureSwitch(!measure);
  };
  const checkUsersEligibility = (values: any) => {
    if (values) {
      HttpService.get("objectives/check-users", {}, { user_id: values }).then(
        res => {
          const users: [] = res?.filter(
            (user: any) => user?.enable_create !== true,
          );
          if (Array.isArray(users) && users.length > 0) {
            setUserObjEligibily(users);
            setMaxObjExceeded(true);
          } else {
            setMaxObjExceeded(false);
            setUserObjEligibily([]);
          }
        },
      );
    }
  };
  const onAssignToChange = (values: any) => {
    if (!Array.isArray(values)) {
      values = [values];
    }
    checkUsersEligibility(values);
  };
  useEffect(() => {
    if (props.user_id) {
      checkUsersEligibility([props.user_id]);
    }
  }, [props.user_id]);
  return (
    <Wrapper>
      <div className="card">
        {isMaxObjExceeded && (
          <Alert
            message="Following user's exceeded maximum objectives per year"
            description={
              <Row gutter={8}>
                {userObjEligibily?.map((user: any, index: number) => (
                  <Col span={6} key={index}>
                    <UserChip
                      name={user?.display_name}
                      img={user?.profile_photo}
                    />
                  </Col>
                ))}
              </Row>
            }
            type="error"
            closable
          />
        )}
        <Form
          layout="vertical"
          onFinish={(value: any) => {
            value.shared = isShared;
            props.onSubmit(value, Status);
          }}
          form={form}
          name="objective"
          initialValues={{
            assign_to: [props.user_id],
            objective_description: props?.objData?.description ?? undefined,
            category: props?.objData?.category ?? undefined,
            uom: props?.objData?.uom ?? undefined,
            target: props?.objData?.target ?? undefined,
            from: props?.fromDate ? moment(props?.fromDate) : undefined,
            to: props?.toDate ? moment(props?.toDate) : undefined,
          }}
        >
          <Row>
            <Col span={24}>
              <Item
                label="Objective Description"
                name="objective_description"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Objective Description",
                  },
                ]}
              >
                <Input />
              </Item>
            </Col>
          </Row>

          <Row gutter={12} className="rowStyle">
            <Col span={5} md={5} xs={24}>
              <Item
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please Select Category",
                  },
                ]}
              >
                <Select style={{ width: "100%" }} placeholder="Select">
                  <Option value="aspirational">Aspirational</Option>
                  <Option value="operational">Operational</Option>
                </Select>
              </Item>
            </Col>
            <Col span={2} md={2} xs={24}>
              <Item label="Shared" name="shared">
                <Switch checked={isShared} onChange={toggleSwitch} />
              </Item>
            </Col>
            <Col span={8} md={8} xs={24}>
              <Item label="Assigned To" name="assign_to">
                <Select2
                  entity={AssignToEndPoints}
                  default={{
                    name: props.user_name,
                    value: props.user_id,
                  }}
                  entity_id="display_name"
                  style={{ width: "100%" }}
                  placeholder="Me/Select Member"
                  disabled={
                    true
                    // !conditions[props.objectiveType]["assign"] ||
                    // (props.objectiveType === "org" && !isShared) ||
                    // props.objectiveType === "cross_team"
                  }
                  onChange={onAssignToChange}
                ></Select2>
              </Item>
            </Col>
            <Col span={9} md={9} xs={24}>
              <Item label="Timeline">
                <Row gutter={6}>
                  <Col span={12} md={12} xs={24}>
                    <Item
                      name="from"
                      rules={[
                        {
                          required: true,
                          message: "Please Select From Date",
                        },
                      ]}
                    >
                      <DatePicker
                        showToday={false}
                        placeholder="From"
                        format="DD-MMM-YYYY"
                        style={{ width: "100%" }}
                        disabledDate={current => {
                          return (
                            current.isAfter(
                              moment(props.toDate).add(1, "days"),
                            ) || current.isBefore(moment(props.fromDate))
                          );
                        }}
                      />
                    </Item>
                  </Col>
                  <Col span={12} md={12} xs={24}>
                    <Item
                      name="to"
                      rules={[
                        {
                          required: true,
                          message: "Please Select To Date",
                        },
                      ]}
                    >
                      <DatePicker
                        showToday={false}
                        style={{ width: "100%" }}
                        placeholder="To"
                        format="DD-MMM-YYYY"
                        disabledDate={current => {
                          return (
                            current.isAfter(
                              moment(props.toDate).add(1, "days"),
                            ) || current.isBefore(moment(props.fromDate))
                          );
                        }}
                      />
                    </Item>
                  </Col>
                </Row>
              </Item>
            </Col>
          </Row>
          <Row gutter={12} className="rowStyle hide">
            <Col span={4} md={4} xs={24}>
              <Item label="Measured" name="measurable">
                <Switch checked={measure} onChange={measureSwitch} />
              </Item>
            </Col>
            <Col span={12} md={12} xs={24}>
              <Row gutter={12}>
                <Col span={12} md={12} xs={24}>
                  <Item
                    name="uom"
                    label="Uom"
                    rules={[
                      {
                        required: measure,
                        message: "Please Select the UoM",
                      },
                    ]}
                  >
                    <Select2
                      entity="unit-of-measurements"
                      style={{ width: "100%" }}
                      placeholder="Select"
                      disabled={measure ? false : true}
                    />
                  </Item>
                </Col>
                <Col span={12} md={12} xs={24}>
                  <Item
                    label="Target"
                    name="target"
                    rules={[
                      {
                        required: measure,
                        message: "Please enter the target",
                      },
                    ]}
                  >
                    <InputNumber
                      disabled={measure ? false : true}
                      min={0}
                      style={{ width: "100%" }}
                    />
                  </Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Footer>
            <Button
              type="primary"
              className="btn"
              htmlType="button"
              onClick={() => {
                setStatus("save");
                form.submit();
              }}
              disabled={isMaxObjExceeded}
            >
              Save & Close
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setStatus("create-kr");
                form.submit();
              }}
              htmlType="button"
              className="btn"
              disabled={isMaxObjExceeded}
            >
              Create Key Result
            </Button>
          </Footer>
        </Form>
      </div>
    </Wrapper>
  );
};

export default Objective;
