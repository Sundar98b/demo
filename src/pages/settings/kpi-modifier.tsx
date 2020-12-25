import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";

import FormFooter from "../../components/form-footer";
import Select2 from "../../components/select2";
import { ModifierProps } from "../../utils/types";

const { Item } = Form;

const KPIModifier: React.FC<ModifierProps> = props => {
  const [form] = Form.useForm();
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
        layout="vertical"
        onFinish={value => {
          props.onSubmit(value);
          setLoading(true);
        }}
        form={form}
        wrapperCol={{ span: 17 }}
      >
        <Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter the name",
            },
          ]}
        >
          <Input />
        </Item>
        <Item label="Description" name="description">
          <Input.TextArea />
        </Item>
        <Item
          label="Unit of Measurement"
          name="uom"
          rules={[
            {
              required: true,
              message: "Please select Unit of Measurement",
            },
          ]}
        >
          <Select2 entity="unit-of-measurements" />
        </Item>
        <Item name="id" style={{ display: "none" }}>
          <Input />
        </Item>

        <FormFooter>
          <Button
            style={{ marginRight: 8 }}
            htmlType="reset"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={Loading}>
            Submit
          </Button>
        </FormFooter>
      </Form>
    </div>
  );
};

export default KPIModifier;
