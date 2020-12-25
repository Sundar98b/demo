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

const ObjectiveModifier: React.FC<ModifierProps> = props => {
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const [startDate, setstartDate]: [any, Function] = useState();
  const [endDate, setendDate]: [any, Function] = useState();
  const state = useSelector((state: any) => state.INITIAL_DATA?.app_settings);
  const [cycles, setCycles] = useState<any>(state.settings?.cycles);
  const [objDetails, setObjDetails] = useState<any | undefined>({});

  useEffect(() => {
    const config: any = Utils.getStartAndEndDate(
      props.cycle,
      state?.settings.cycles,
    );

    setstartDate(moment(config.start));
    setendDate(moment(config.end));
    let tempCycles = Utils.getPerformaceCycles(state.settings);
    setCycles(tempCycles);
    return () => {
      setCycles(undefined);
    };
  }, [props.cycle, state]);

  useEffect(() => {
    const intialValue: any = {
      description: props.description,
      start_date: moment(props.start_date),
      end_date: moment(props.end_date),
      performance_cycle: props.performance_cycle,
      cycle: props.cycle,
      category: props.category,
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
        <Input.TextArea rows={4} />
      </Item>
      <Item
        style={{ marginTop: "1rem" }}
        label="Performance Cycle"
        name="performance_cycle"
      >
        <Select2
          disabled={props?.no_of_kr > 0}
          onSelect={(value: any, options: any) => {
            console.log(
              `select values: ${JSON.stringify(
                value,
              )} options: ${JSON.stringify(options)}, `,
            );
            const values: any = form.getFieldsValue();
            values.start_date = moment(options.start);
            values.end_date = moment(options.end);
            setstartDate(options.start);
            setendDate(options.end);
            values.cycle = options.cycle;
            form.setFieldsValue(values);
          }}
          options={
            cycles?.map((cycle: any) => {
              cycle.value = cycle.name;
              return cycle;
            }) || []
          }
        ></Select2>
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
        <Select style={{ width: "100%" }}>
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
          disabled={props?.no_of_kr > 0}
          style={{ width: "100%" }}
          placeholder="From"
          showToday={false}
          format="DD-MMM-YYYY"
          disabledDate={current => {
            return (
              current.isAfter(moment(endDate).add("day", "1")) ||
              current.isBefore(moment(startDate))
            );
          }}
        />
      </Item>
      <Item
        style={{ marginTop: "1rem" }}
        name={"end_date"}
        label="End Date"
        rules={[
          {
            required: true,
            message: " Please Select End Date",
            validator: () => {
              if (moment(endDate).isAfter(startDate)) {
                return Promise.resolve();
              } else {
                message.error("Start Date is Greater than End Date");
                return Promise.reject("Start Date is Greater than End Date");
              }
            },
          },
        ]}
      >
        <DatePicker
          disabled={props?.no_of_kr > 0}
          style={{ width: "100%" }}
          placeholder="To"
          showToday={false}
          format="DD-MMM-YYYY"
          disabledDate={current => {
            return (
              current.isAfter(moment(endDate).add("day", "1")) ||
              current.isBefore(moment(startDate))
            );
          }}
        />
      </Item>
      <Item label="Assigned To" style={{ marginTop: "1rem" }}>
        <UserChip name={props?.user_name} img={props.profile_photo} />
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

export default ObjectiveModifier;
