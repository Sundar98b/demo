import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/lib/form/util";

import FormFooter from "../../components/form-footer";
import { ModifierProps } from "../../utils/types";

const { Item } = Form;

const LocationModifier: React.FC<ModifierProps> = props => {
  const [form] = useForm();
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    form.setFieldsValue(props);
    setLoading(false);
    return () => {
      form.resetFields();
    };
  }, [form, props]);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        wrapperCol={{ span: 17 }}
        onFinish={value => {
          setLoading(true);
          props.onSubmit(value);
        }}
      >
        <Item
          label="Location Name"
          name="identification_name"
          rules={[
            {
              required: true,
              message: "Please Enter Location Name",
            },
          ]}
        >
          <Input />
        </Item>
        <Item label="Address" name="line_1">
          <Input />
        </Item>
        <Item
          label="City"
          name="city"
          rules={[
            {
              required: true,
              message: "Please Enter City Name",
            },
          ]}
        >
          <Input />
        </Item>
        <Item label="Region" name="region">
          <Input />
        </Item>
        <Item label="Province" name="state">
          <Input />
        </Item>

        <Item label="Country" name="country">
          <Input />
        </Item>
        <Item label="ZIP code" name="pincode">
          <Input />
        </Item>

        <Item name="id" style={{ display: "none" }}>
          <Input />
        </Item>
        <FormFooter>
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={Loading}>
            Submit
          </Button>
        </FormFooter>
      </Form>
    </div>
  );
};

export default LocationModifier;
