import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tooltip,
  message,
} from "antd";
import { useSelector } from "react-redux";

import FormFooter from "../../../../components/form-footer";
import Select2 from "../../../../components/select2";
import { ModifierProps } from "../../../../utils/types";

const { Item } = Form;

const KRModifiers: React.FC<ModifierProps> = props => {
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const [isSetAssignToAPI, setAssignToAPI] = useState(false);
  const [AssignToEndPoints, setAssignToEndPoints] = useState("users");
  const [isActivity, setisActivity] = useState(false);
  const [uomDisabled, setuomDisabled] = useState(false);
  const [StartingDisabled, setStartingDisabled] = useState(false);
  const [StartingRequired, setStartingRequired] = useState([]);
  const [Starting, setStarting] = useState("");
  const [Target, setTarget] = useState("");
  const state = useSelector((state: any) => state.INITIAL_DATA);
  useEffect(() => {
    const item = { ...props };
    if (
      state?.app_settings?.settings &&
      (state?.roles?.name === "Product Admin" ||
        state?.roles?.name === "Org Admin" ||
        state?.app_settings?.settings["assign-rule"] === true)
    ) {
      setAssignToEndPoints("users");
      setAssignToAPI(true);
    } else {
      if (
        item.objective_type === "team" ||
        item.objective_type === "org" ||
        item.objective_type === "own"
      ) {
        setAssignToEndPoints("users/direct-reportees");
        setAssignToAPI(true);
      } else if (item.objective_type === "cross_team") {
        setAssignToEndPoints("users/secondary-reportees");
        setAssignToAPI(true);
      }
    }
  }, [state?.app_settings?.settings?.assign, props]);

  useEffect(() => {
    const item = { ...props };
    if (item.start_date) {
      item.start_date = moment(item.start_date);
    }
    if (item.end_date) {
      item.end_date = moment(item.end_date);
    }
    if (item.is_activity) {
      setisActivity(true);
    } else {
      setisActivity(false);
    }
    if (!item.boundaries) {
      item.boundaries = "none";
    }
    //if user id is not defined give login user id as default
    if (!item.user_id) {
      item.user_id = state?.user?.id;
    }
    form.setFieldsValue(item);
    setLoading(false);
    return () => {
      form.resetFields();
    };
  }, [form, props]);

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={value => {
          setLoading(true);

          value.start_date = moment(value.start_date).format("DD-MMM-YYYY");
          value.end_date = moment(value.end_date).format("DD-MMM-YYYY");

          props.onSubmit(value);
        }}
        form={form}
        wrapperCol={{ span: 17 }}
      >
        <Item label="id" name="id" style={{ display: "none" }}>
          <Input />
        </Item>
        <Item
          label="performance_cycle"
          name="performance_cycle"
          style={{ display: "none" }}
        >
          <Input />
        </Item>
        <Item label="cycle" name="cycle" style={{ display: "none" }}>
          <Input />
        </Item>
        <Item
          label="objective_id"
          name="objective_id"
          style={{ display: "none" }}
        >
          <Input />
        </Item>
        <Form.Item
          label="Description"
          name={"description"}
          rules={[
            {
              required: true,
              message: "Please enter the description",
            },
          ]}
        >
          <Input.TextArea autoSize placeholder="Description" />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name={"start_date"}
          rules={[{ required: true, message: "Please select the start date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="From"
            showToday={false}
            format="DD-MMM-YYYY"
            disabledDate={current => {
              return (
                current.isAfter(moment(props.end_date)) ||
                current.isBefore(moment(props.start_date))
              );
            }}
          />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="end_date"
          rules={[
            {
              required: true,
              message: "Please select the End Date",
              validator: () => {
                const fieldValue: any = form.getFieldsValue();
                if (
                  moment(fieldValue.end_date).isAfter(fieldValue.start_date)
                ) {
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
            style={{ width: "100%" }}
            placeholder="To"
            showToday={false}
            format="DD-MMM-YYYY"
            disabledDate={current => {
              return (
                current.isAfter(moment(props.end_date)) ||
                current.isBefore(moment(props.start_date))
              );
            }}
          />
        </Form.Item>

        <Form.Item
          label="Assign To"
          name={"user_id"}
          rules={[{ required: true, message: "Please Select Assign To" }]}
        >
          <Select2
            placeholder="Assign To"
            entity={isSetAssignToAPI ? AssignToEndPoints : undefined}
            entity_id="display_name"
            style={{ width: "100%" }}
            disabled={props.objectiveType === "own" ? true : false}
            default={{
              name: props.user_name
                ? props.user_name
                : state?.user?.display_name,
              value: props.user_id ? props.user_id : state?.user?.id,
            }}
          />
        </Form.Item>

        <Form.Item
          name={"weightage"}
          label="Weightage"
          rules={[
            {
              required: true,
              message: "Please enter the weightage",
            },
          ]}
        >
          <InputNumber
            placeholder="Weightage"
            style={{ width: "100%" }}
            max={100}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Is Activity"
          name={"is_activity"}
          valuePropName="checked"
        >
          <Switch
            onChange={() => {
              setisActivity(!isActivity);
            }}
          />
        </Form.Item>

        {isActivity && (
          <Form.Item
            name={"activity_description"}
            label="Activity Description"
            rules={[
              {
                required: true,
                message: "Please Enter the Activity Description",
              },
            ]}
          >
            <Input placeholder="Activity Name" />
          </Form.Item>
        )}
        {!isActivity && (
          <>
            <Form.Item name={"kpi"} label="KPI">
              <Select2
                placeholder="KPI"
                entity="kpi"
                style={{ width: "100%" }}
                onSelect={(id: any, item: any) => {
                  let newFormValues: any = form.getFieldsValue();
                  newFormValues["uom"] = item.item.uom;
                  form.setFieldsValue(newFormValues);
                  setuomDisabled(true);
                }}
              />
            </Form.Item>

            <Form.Item
              name={"uom"}
              label="Unit of Measurement"
              rules={[
                {
                  required: true,
                  message: "Please Select the UOM",
                },
              ]}
            >
              <Select2
                placeholder="UoM"
                disabled={uomDisabled}
                entity="unit-of-measurements"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Boundaries"
              name={"boundaries"}
              rules={[
                { required: true, message: "Please Select the Boundaries" },
              ]}
            >
              <Select
                placeholder="Boundaries"
                onChange={val => {
                  let rules: any = [];
                  let disabled: any = false;
                  if (
                    val === "through" ||
                    val === "upto" ||
                    val === "maximum"
                  ) {
                    rules = [{ required: true, message: "required" }];
                  }
                  if (
                    val === "through" ||
                    val === "upto" ||
                    val === "maximum"
                  ) {
                    disabled = true;
                  } else {
                    disabled = false;
                  }
                  if (!rules.length) {
                    let formValues: any = form.getFieldsValue();
                    formValues["starting"] = null;
                    form.setFieldsValue(formValues);
                  }
                  setStartingDisabled(disabled);
                  setStartingRequired(rules);
                }}
              >
                <Select.Option value="none">Progressive</Select.Option>
                <Select.Option value="minimum">Minimum</Select.Option>
                <Select.Option value="maximum">Maximum</Select.Option>
                <Select.Option value="through">Through</Select.Option>
                <Select.Option value="upto">Upto</Select.Option>
              </Select>
            </Form.Item>

            <Tooltip title={Starting ? Starting.toLocaleString() : "Starting"}>
              <Form.Item
                label="Starting"
                name={"starting"}
                rules={StartingRequired}
              >
                <Input
                  type="number"
                  step=".01"
                  disabled={!StartingDisabled}
                  onChange={e => {
                    let val: any = e.target.value;
                    val = parseFloat(val);
                    val = parseFloat(val.toFixed(4));
                    setStarting(val);
                  }}
                  placeholder="Starting"
                />
              </Form.Item>
            </Tooltip>

            <Tooltip title={Target ? Target.toLocaleString() : "Target"}>
              <Form.Item
                label="Target"
                name={"target"}
                rules={[{ required: true, message: "Please enter a target" }]}
              >
                <Input
                  type="number"
                  step=".01"
                  onChange={e => {
                    let val: any = e.target.value;
                    val = parseFloat(val);
                    val = parseFloat(val.toFixed(4));
                    setTarget(val);
                  }}
                  placeholder="Target"
                />
              </Form.Item>
            </Tooltip>
          </>
        )}

        <FormFooter>
          <Button
            onClick={props.onCancel}
            style={{ marginRight: 8 }}
            htmlType="reset"
          >
            Cancel
          </Button>
          <Button type="primary" loading={Loading} htmlType="submit">
            Submit
          </Button>
        </FormFooter>
      </Form>
    </div>
  );
};

export default KRModifiers;
