import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/util";
import { useSelector } from "react-redux";

import FormFooter from "../../components/form-footer";
import Select2 from "../../components/select2";

const { Option } = Select;
interface Props {
  onSubmit(values: any): void;
  data: any;
  onClose(): void;
  btnloader: boolean;
}
const TaskModifier: React.FC<Props> = (props: Props) => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const [form] = useForm();
  const [assignType, setAssignType] = useState<string | undefined>(undefined);
  const [isRecurrenceTask, setRecurrenceTask] = useState<boolean>(false);
  useEffect(() => {
    if (props.data) {
      const data = props.data;
      data["target_date"] = data["target_date"]
        ? moment(data["target_date"])
        : undefined;
      form.setFieldsValue(props.data);
    }
    return () => {
      form.resetFields();
      setAssignType(undefined);
      setRecurrenceTask(false);
    };
  }, [form, props]);

  const onFinish = (values: any) => {
    if (props.data && props.data["id"]) {
      values["id"] = props.data["id"];
      values["recurrence"] = props.data["recurrence"];
    } else {
      values["status"] = "Open";
      if (values["assign_type"] === "Individual") {
        // eslint-disable-next-line no-self-assign
        values["assign_to"] = values["assign_to"]; // Intentionally assigned
      } else if (values["assign_type"] === "Me") {
        values["assign_to"] = "Me";
      } else if (values["assign_type"] === "MyTeam") {
        values["assign_to"] = "MyTeam";
      }
      delete values["assign_type"];
    }
    if (!state?.user?.is_manager) {
      // values["assign_to"] = state?.user?.id;
      values["assign_to"] = "Me";
    }
    values["target_date"] = moment(values["target_date"]).format();
    props.onSubmit(values);
  };
  const checkOccurrences = (rule: any, value: any) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject("no. of occurrences must be greater than zero!");
  };
  return (
    <div>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          <Col span={16} xs={18}>
            <Form.Item
              name="name"
              label="Task Description"
              rules={[{ required: true, message: "Please enter user name" }]}
            >
              <Input.TextArea placeholder="Please enter task description" />
            </Form.Item>
            {/* <Form.Item
              name="description"
              label="Task Description"
              rules={[
                { required: true, message: "Please enter task description" },
              ]}
            >
              <Input.TextArea placeholder="Please enter task description" />
            </Form.Item> */}
            {state?.user?.is_manager && !props.data["id"] && (
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item
                    name="assign_type"
                    label="Assign to"
                    rules={[
                      { required: true, message: "Please select Assign" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value: string) => setAssignType(value)}
                    >
                      <Option value="Me">Me</Option>
                      <Option value="MyTeam">MyTeam</Option>
                      <Option value="Individual">Individual</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  {assignType === "Individual" && (
                    <Form.Item
                      name="assign_to"
                      label="Users"
                      rules={[
                        { required: true, message: "Please select users" },
                      ]}
                    >
                      <Select2
                        entity="users/direct-reportees"
                        default={{
                          name: state?.user?.display_name,
                          value: state?.user?.id,
                        }}
                        entity_id="display_name"
                        style={{ width: "100%" }}
                        placeholder="Me/Select Member"
                        mode="multiple"
                      />
                    </Form.Item>
                  )}
                </Col>
              </Row>
            )}
            {state?.user?.is_manager && props.data["id"] && (
              <Form.Item
                name="assign_to"
                label="Assign to"
                rules={[{ required: true, message: "Please select users" }]}
              >
                <Select2
                  entity={
                    state?.app_settings?.assign !== "private"
                      ? "users"
                      : "users/direct-reportees"
                  }
                  default={{
                    name: state?.user?.display_name,
                    value: state?.user?.id,
                  }}
                  entity_id="display_name"
                  style={{ width: "100%" }}
                  placeholder="Me/Select Member"
                />
              </Form.Item>
            )}
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: false, message: "Please select priority" }]}
            >
              <Select style={{ width: "100%" }}>
                <Option value="High">High</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
              </Select>
            </Form.Item>
            {/* {props?.data?.id && (
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select Status" }]}
              >
                <Select style={{ width: "100%" }}>
                  <Option value="Open">Open</Option>
                  <Option value="Inprogress">Inprogress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            )} */}
            <Form.Item
              name="target_date"
              label="Target Date"
              rules={[{ required: true, message: "Please Choose Target date" }]}
            >
              <DatePicker
                format="DD-MMM-YYYY"
                inputReadOnly
                disabledDate={(currentDate: Moment) =>
                  currentDate.isBefore(moment().subtract(1, "days"))
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
            {!props.data?.id && (
              <Form.Item name="recurrence" label="Recurrence">
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  onChange={(value: string) => {
                    setRecurrenceTask(value ? true : false);
                  }}
                >
                  <Option value="Daily">Daily</Option>
                  <Option value="Weekly">Weekly</Option>
                  <Option value="Monthly">Monthly</Option>
                </Select>
              </Form.Item>
            )}
            {!props.data?.id && (
              <Form.Item
                name="no_of_occurrences"
                label="No. of Occurrences"
                rules={[
                  {
                    required: isRecurrenceTask,
                    message: "please enter no. of occurrences",
                  },
                  {
                    validator: isRecurrenceTask ? checkOccurrences : undefined,
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            )}
          </Col>
        </Row>
        <FormFooter>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={props.btnloader}
            disabled={props.btnloader}
          >
            Submit
          </Button>
        </FormFooter>
      </Form>
    </div>
  );
};

export default TaskModifier;
