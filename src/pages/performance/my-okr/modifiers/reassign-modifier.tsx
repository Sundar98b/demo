import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  message,
} from "antd";
import { useSelector } from "react-redux";

import CrossTeam from "../../../../assets/cross-team.svg";
import FormFooter from "../../../../components/form-footer";
import Org from "../../../../assets/org.svg";
import Select2 from "../../../../components/select2";
import Team from "../../../../assets/team.svg";
import User from "../../../../assets/user2.svg";
import UserChip from "../../../../components/user-chip";
import Utils from "../../../../utils";
import { ModifierProps } from "../../../../utils/types";

const Flexbox = styled.div`
  font-family: sans-serif;
  flex-direction: column;
  display: flex;
  justify-content: center;
  padding-top: 2rem;
`;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16, offset: 1 },
};

const { Item } = Form;

const ReassignModifier: React.FC<ModifierProps> = props => {
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const state = useSelector((state: any) => state.INITIAL_DATA?.app_settings);
  const [objDetails, setObjDetails] = useState<any | undefined>({});

  useEffect(() => {
    const intialValue: any = {
      description: props.description,
      start_date: moment(props.start_date),
      end_date: moment(props.end_date),
      performance_cycle: props.performance_cycle,
      cycle: props.cycle,
      category: props.category,
      user_id: props.user_id,
      id: props.id,
    };

    form.setFieldsValue(intialValue);
    setLoading(false);

    if (props.objective_type) {
      switch (props.objective_type) {
        case "own":
          setObjDetails({
            src: User,
            value: "My Objective",
          });
          break;
        case "team":
          setObjDetails({
            src: Team,
            value: "My Team",
          });
          break;
        case "cross_team":
          setObjDetails({
            src: CrossTeam,
            value: "Cross Functional Team",
          });
          break;
        case "org":
          setObjDetails({
            src: Org,
            value: "My Organisation",
          });
          break;
      }
    }
    return () => {
      form.resetFields();
    };
  }, [form, props]);

  return (
    <Form
      {...layout}
      onFinish={value => {
        setLoading(true);
        props.onSubmit(value);
      }}
      form={form}
    >
      <Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please Enter the description" }]}
      >
        <Input.TextArea rows={4} disabled />
      </Item>
      <Item
        style={{ marginTop: "1rem" }}
        label="Performance Cycle"
        name="performance_cycle"
      >
        <Select2 disabled></Select2>
      </Item>
      <Item label="Objective Type" style={{ marginTop: "1rem" }}>
        <Avatar size="small" src={objDetails.src} shape="square" />{" "}
        {objDetails.value}
        <Col style={{ float: "right" }}>
          <b>{"Shared "}</b>
          <Switch checked={props?.is_shared} disabled />
        </Col>
      </Item>
      <Item name="id" style={{ display: "none", marginTop: "1rem" }}>
        <Input />
      </Item>
      <Item name="cycle" style={{ display: "none", marginTop: "1rem" }}>
        <Input />
      </Item>
      <Item
        style={{ marginTop: "1rem" }}
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select style={{ width: "100%" }} disabled>
          <Select.Option value="aspirational">Aspirational</Select.Option>
          <Select.Option value="operational">Operational</Select.Option>
        </Select>
      </Item>
      <Item
        style={{ marginTop: "1rem" }}
        name="start_date"
        label="Start Date"
        rules={[{ required: true, message: "Please select Start Date" }]}
      >
        <DatePicker
          disabled
          style={{ width: "100%" }}
          placeholder="From"
          showToday={false}
          format="DD-MMM-YYYY"
        />
      </Item>
      <Item style={{ marginTop: "1rem" }} name={"end_date"} label="End Date">
        <DatePicker
          disabled
          style={{ width: "100%" }}
          placeholder="To"
          showToday={false}
          format="DD-MMM-YYYY"
        />
      </Item>
      <Item name={"user_id"} label="Assigned To" style={{ marginTop: "1rem" }}>
        <Select2
          entity={"users/direct-reportees"}
          entity_id="display_name"
          default={{
            name: props.user_name,
            value: props.user_id,
          }}
          style={{ width: "100%" }}
          placeholder="Me/Select Member"
        ></Select2>
      </Item>
      <Flexbox>No of KRs for this Objective: {props?.no_of_kr}</Flexbox>
      <FormFooter>
        <Button htmlType="reset" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={Loading}>
          Save
        </Button>
      </FormFooter>
    </Form>
  );
};

export default ReassignModifier;
