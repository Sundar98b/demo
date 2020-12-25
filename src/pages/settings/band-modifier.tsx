import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";

import FormFooter from "../../components/form-footer";
import { ModifierProps } from "../../utils/types";

const { Item } = Form;

const BandModifier: React.FC<ModifierProps> = props => {
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
          setLoading(true);
          props.onSubmit(value);
        }}
        form={form}
        wrapperCol={{ span: 17 }}
      >
        <Item label="Name" name="name">
          <Input />
        </Item>
        <Item label="Description" name="description">
          <Input.TextArea />
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

export default BandModifier;
