import moment from "moment";
import styled from "styled-components";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
  notification,
} from "antd";

import HttpService from "../../services/httpService";

const { Item } = Form;

const Wrapper = styled.div`
  overflow-y: auto;
  .card-row {
    border: 1px solid rgb(235, 237, 240);
    padding: 0 12px;
    margin-bottom: 12px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

const FormFooter = styled.div`
  text-align: right;
  padding: 10px;
  border-top: 1px solid rgb(222, 222, 222);
  background: rgb(247, 247, 247);
`;
const Application: React.FC = () => {
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const [Cycles, setCycles] = useState([]);
  const [assignStatus, setassignStatus] = useState(false);

  const tenant_id = (window as any).tenant_id;
  useEffect(() => {
    HttpService.get("app-settings")
      .then(res => {
        const settings = res.settings;

        const formatedSettings = {
          start_date: moment(settings.start_date),
          end_date: moment(settings.end_date),
          max_goal_per_year: settings.max_goal_per_year,
          max_obj_per_emp: settings.max_obj_per_emp,
          kr_checkin_approval: settings.kr_checkin_approval,
          obj_auto_close: settings.obj_auto_close,
          assign: settings.assign,
          "assign-rule": settings["assign-rule"],
          okr_closed_checkin: settings.okr_closed_checkin,
          okr_closed_creation: settings.okr_closed_creation,
          okr_yop_checkin: settings.okr_yop_checkin,
          okr_yop_creation: settings.okr_yop_creation,
          frequency: settings.frequency,
          obj_new_approval: settings.obj_new_approval,
        };

        form.setFieldsValue(formatedSettings);
        setCycles(settings.cycles);
        setassignStatus(formatedSettings["assign-rule"]);
        setLoading(false);
      })
      .catch(() => {
        console.error("error");
      });
    return () => {
      form.resetFields();
    };
  }, [form]);

  const getName = (from: any, to: any, prefix: string) => {
    const year1 = moment(from).format("Y");
    const year2 = moment(to).format("Y");
    if (year1 === year2) {
      return year1 + " " + prefix;
    } else {
      return year1 + "-" + year2 + " " + prefix;
    }
  };

  const setCycleValue = (name: string, que: string) => {
    const newCycle = [...Cycles];
    newCycle.map((item: any) => {
      if (item.cycle === que) {
        item.name = name;
      }
      return item;
    });
    setCycles(newCycle);
  };

  const getCycles = () => {
    let cycle: any = [];
    let q1, q2, q3, q4;
    const formData = form.getFieldsValue();
    switch (formData.frequency) {
      case "yearly":
        cycle = [
          {
            cycle: "q1",
            end: moment(formData.end_date).format("DD-MMM-YYYY"),
            name: getName(formData.start_date, formData.end_date, "Q1"),
            start: moment(formData.start_date).format("DD-MMM-YYYY"),
          },
        ];
        break;
      case "half-yearly":
        q1 = {
          start: moment(formData.start_date).format("DD-MMM-YYYY"),
          end: moment(formData.start_date)
            .add("months", 6)
            .subtract("days", 1)
            .format("DD-MMM-YYYY"),
        };

        q2 = {
          start: moment(formData.start_date)
            .add("months", 6)
            .format("DD-MMM-YYYY"),
          end: moment(formData.end_date).format("DD-MMM-YYYY"),
        };
        cycle = [
          {
            cycle: "q1",
            start: q1.start,
            end: q1.end,
            name: getName(q1.start, q1.end, "Q1"),
          },
          {
            cycle: "q2",
            start: q2.start,
            end: q2.end,
            name: getName(q2.start, q2.end, "Q2"),
          },
        ];
        break;
      case "quarterly":
        q1 = {
          start: moment(formData.start_date).format("DD-MMM-YYYY"),
          end: moment(formData.start_date)
            .add("months", 3)
            .subtract("day", 1)
            .format("DD-MMM-YYYY"),
        };

        q2 = {
          start: moment(formData.start_date)
            .add("months", 3)
            .format("DD-MMM-YYYY"),
          end: moment(formData.start_date)
            .add("months", 6)
            .subtract("days", 1)
            .format("DD-MMM-YYYY"),
        };
        q3 = {
          start: moment(formData.start_date)
            .add("months", 6)
            .format("DD-MMM-YYYY"),
          end: moment(formData.start_date)
            .add("months", 9)
            .subtract("days", 1)
            .format("DD-MMM-YYYY"),
        };
        q4 = {
          start: moment(formData.start_date)
            .add("months", 9)
            .format("DD-MMM-YYYY"),
          end: moment(formData.start_date)
            .add("months", 12)
            .subtract("days", 1)
            .format("DD-MMM-YYYY"),
        };
        cycle = [
          {
            cycle: "q1",
            start: q1.start,
            end: q1.end,
            name: getName(q1.start, q1.end, "Q1"),
          },
          {
            cycle: "q2",
            start: q2.start,
            end: q2.end,
            name: getName(q2.start, q2.end, "Q2"),
          },
          {
            cycle: "q3",
            start: q3.start,
            end: q3.end,
            name: getName(q3.start, q3.end, "Q3"),
          },
          {
            cycle: "q4",
            start: q4.start,
            end: q4.end,
            name: getName(q4.start, q4.end, "Q4"),
          },
        ];
        break;
      default:
        break;
    }

    setCycles(cycle);
    return <Fragment />;
  };

  const onSubmit = (formData: any) => {
    const data = formData;
    data.cycles = Cycles;
    if (!data["assign-rule"]) {
      data.assign = "private";
    }

    const today = moment();
    let current_cycle = "";
    data.cycles.map((cycle: any) => {
      if (today.isBetween(cycle.start, cycle.end)) {
        current_cycle = cycle.name;
      }
      return cycle;
    });
    data.current_cycle = current_cycle;

    HttpService.put("app-settings", tenant_id, { settings: data })
      .then(() => {
        notification.success({
          message: "Success",
          description: "Settings Saved Successfully",
        });
        window.location.reload();
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Problem while updating the Settings",
        });
      });
  };

  return (
    <Wrapper>
      <Form
        layout="vertical"
        onFinish={value => {
          setLoading(true);
          onSubmit(value);
        }}
        form={form}
      >
        <div className="card-row">
          <p className="ant-form-item-label">
            <label>Year Configuration</label>
          </p>
          <Row>
            <Col span={5}>
              <Item name="start_date">
                <DatePicker
                  format="DD-MMM-YYYY"
                  style={{ width: "100%" }}
                  onChange={e => {
                    let value = { ...form.getFieldsValue() };
                    const end_date = moment(value.start_date)
                      .add("year", 1)
                      .subtract("day", 1);
                    value["end_date"] = end_date;
                    form.setFieldsValue(value);
                    getCycles();
                  }}
                />
              </Item>
            </Col>
            <Col span={5}>
              <Item name="end_date">
                <DatePicker
                  disabled
                  style={{ width: "100%" }}
                  format="DD-MMM-YYYY"
                />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <Item label="Performance Frequency" name="frequency">
                <Select
                  onChange={() => {
                    getCycles();
                  }}
                >
                  <Select.Option value="yearly">Yearly</Select.Option>
                  <Select.Option value="half-yearly">Half Yearly</Select.Option>
                  <Select.Option value="quarterly">Quarterly</Select.Option>
                </Select>
              </Item>
            </Col>
          </Row>
          <table className="c-table">
            <thead>
              <tr>
                <th>Cycle</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {Cycles.map((cycle: any) => (
                <tr key={cycle.cycle}>
                  <td>
                    <Input
                      onChange={e => setCycleValue(e.target.value, cycle.cycle)}
                      value={cycle.name}
                    />
                  </td>
                  <td>{cycle.start}</td>
                  <td>{cycle.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Row className="card-row">
          <Col span={5}>
            <Item name="max_goal_per_year" label="Maximum Goals Per Year">
              <InputNumber />
            </Item>
          </Col>
        </Row>
        <Row className="card-row">
          <Col span={10}>
            <Item
              name="max_obj_per_emp"
              label="Maximum Objectives per Employee per cycle"
            >
              <InputNumber />
            </Item>
          </Col>
        </Row>
        <Row className="card-row">
          <Col span={20}>
            <Item name="kr_checkin_approval" label="KR checkin Approval">
              <Radio.Group>
                <Radio value={"manager-mandatory"}>Manager (mandatory)</Radio>
                <Radio value={"manager-optional"}>Manager (optional)</Radio>
                <Radio value={"automatic"}>Automatic</Radio>
              </Radio.Group>
            </Item>
          </Col>
        </Row>

        <Row className="card-row">
          <Col span={20}>
            <Item
              rules={[
                {
                  required: true,
                  message: " Please select New Objective Approvals Required ",
                },
              ]}
              name="obj_new_approval"
              label="New Objective Approvals Required"
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Item>
          </Col>
        </Row>

        <Row className="card-row">
          <Col span={20}>
            <Item
              rules={[
                {
                  required: true,
                  message: " Please Select Auto Close configuration ",
                },
              ]}
              name="obj_auto_close"
              label="Auto Close the Objectives, after Performance Cycle End date"
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Item>
          </Col>
        </Row>

        <Row className="card-row">
          <Col span={20}>
            <Item
              name="assign-rule"
              label="Options to assign Objective, KR, Sub-KR & Task"
              valuePropName="checked"
            >
              <Checkbox
                onChange={e => {
                  setassignStatus(e.target.checked);
                }}
              >
                Anyone in the organization
              </Checkbox>
            </Item>
          </Col>
          <Col span={24}>
            <Item
              rules={[
                {
                  required: assignStatus,
                  message: " Please Select Assign Configuration",
                },
              ]}
              name="assign"
            >
              <Radio.Group disabled={!assignStatus}>
                <Radio value={"no-accpect"}>No acceptance required</Radio>
                <Radio value={"accept-by-user"}>
                  Acceptence required by assign user
                </Radio>
                <Radio value={"accept-by-manager"}>
                  Acceptence required by assigned user's direct manager
                </Radio>
              </Radio.Group>
            </Item>
          </Col>
        </Row>
        <Row className="card-row">
          <Col span={24}>
            <p className="ant-form-item-label">
              <label>OKR Configuration</label>
            </p>
            <table className="c-table">
              <thead>
                <tr>
                  <th>Pref.Cycle</th>
                  <th>Checkin Allowed</th>
                  <th>Creation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Closed</th>
                  <td>
                    <Item valuePropName="checked" name="okr_closed_checkin">
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Item>
                  </td>
                  <td>
                    <Item valuePropName="checked" name="okr_closed_creation">
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Item>
                  </td>
                </tr>
                <tr>
                  <th>Yet to Open</th>
                  <td>
                    <Item valuePropName="checked" name="okr_yop_checkin">
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Item>
                  </td>
                  <td>
                    <Item valuePropName="checked" name="okr_yop_creation">
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Item>
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <FormFooter>
          <Button
            style={{ marginRight: 8 }}
            htmlType="reset"
            onClick={() => {
              window.location.reload();
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={Loading}>
            Submit
          </Button>
        </FormFooter>
      </Form>
    </Wrapper>
  );
};

export default Application;
