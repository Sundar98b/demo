import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Col, Form, Radio, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";

import Select2 from "../select2";
import useStickyState from "../../hooks/use-sticky";
import { SetInitialData } from "../../redux/actions/init";
import { changeFilters } from "../../redux/actions/filters";

interface Filter {
  user_id: string;
}
const Wrapper = styled.div`
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
`;
const Strong = styled.div`
  font-weight: bold;
`;
const Option = Select.Option;

const Filter: React.FC<Filter> = props => {
  const [isExpand, setisExpand] = useStickyState(false, "expand");
  const dispacther = useDispatch();
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [department, setdepartment] = useState([]);
  const [users, setusers] = useState([]);
  const [perfCycle, setperfCycle] = useState();
  const [userDisabled, setuserDisabled] = useState(false);
  const [deptDisabled, setdeptDisabled] = useState(false);
  const [cycles, setCycles] = useState<any>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (state && state.app_settings && state.app_settings.settings.cycles) {
      setCycles(state.app_settings.settings.cycles);
    }
    if (!perfCycle) {
      const cy = state.app_settings.settings.current_cycle;
      setperfCycle(cy);
      const val = form.getFieldsValue();
      form.setFieldsValue({ ...val, performance_cycle: cy });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const newState = { ...state };
    newState["isExpand"] = isExpand;
    dispacther(SetInitialData(newState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispacther, isExpand]);

  useEffect(() => {
    dispacther(
      changeFilters({
        users,
        department,
        performance_cycle: perfCycle,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfCycle, department, users]);

  return (
    <Wrapper>
      <Form form={form} layout="vertical">
        <Form.Item name="department" label="Department">
          <Select2
            mode="multiple"
            entity={"users/reporting-departments/" + props.user_id}
            disabled={deptDisabled}
            onChange={(val: any) => {
              setuserDisabled(!!val && val.length > 0);
              setdepartment(val);
            }}
          />
        </Form.Item>
        <Form.Item name="users" label="Users">
          <Select2
            mode="multiple"
            entity={"users/reporting-users/" + props.user_id}
            entity_id="display_name"
            disabled={userDisabled}
            onChange={(val: any) => {
              setdeptDisabled(!!val && val.length > 0);
              setusers(val);
            }}
          />
        </Form.Item>

        <Form.Item name="performance_cycle" label="Performance Cycle">
          <Select onChange={(val: any) => setperfCycle(val)}>
            {cycles.map((cycle: any) => (
              <Option value={cycle.name} key={cycle.name}>
                {cycle.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <div style={{ padding: "4px 0" }}>
        <Row>
          <Col>
            <Strong>View Mode</Strong>
          </Col>
          <Col>
            &nbsp;&nbsp;
            <Radio.Group
              onChange={() => setisExpand(!isExpand)}
              value={isExpand}
              size="small"
            >
              <Radio.Button value={true}>Expand</Radio.Button>
              <Radio.Button value={false}>Contract</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </div>
    </Wrapper>
  );
};

export default Filter;
