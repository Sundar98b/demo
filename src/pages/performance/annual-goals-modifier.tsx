import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber } from "antd";

import FormFooter from "../../components/form-footer";
import { ModifierProps } from "../../utils/types";

const AnnualGoalModifier: React.FC<ModifierProps> = props => {
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const max = 100 - parseInt(props.max, 10);
  useEffect(() => {
    form.setFieldsValue(props);
    setLoading(false);
  }, [form, props]);
  return (
    <Form
      wrapperCol={{ span: 16 }}
      onFinish={val => {
        setLoading(true);
        props.onSubmit(val);
      }}
      layout="vertical"
      form={form}
    >
      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Please enter the Description of the goal",
          },
        ]}
      >
        <Input.TextArea placeholder="Goal Description" />
      </Form.Item>

      <Form.Item
        label="Weightage"
        name="weightage"
        rules={[
          {
            required: true,
            message: "Please enter the Weightage",
          },
          {
            type: "number",
            max: max,
            message: "Maximum allowed weightage is " + max,
          },
        ]}
      >
        <InputNumber
          placeholder="Weightage"
          max={max}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Id" name="id" style={{ display: "none" }}>
        <Input readOnly />
      </Form.Item>
      <FormFooter>
        <Button htmlType="reset" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button htmlType="submit" loading={Loading} type="primary">
          Submit
        </Button>
      </FormFooter>
    </Form>
  );
};

export default AnnualGoalModifier;
