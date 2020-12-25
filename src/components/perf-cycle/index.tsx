import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";

interface PerfCycleProps {
  [x: string]: any;
}
const Option = Select.Option;

const PerfCycle: React.FC<PerfCycleProps> = props => {
  const [cycles, setCycles] = useState<any>([]);
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [value, setvalue] = useState("");
  useEffect(() => {
    if (state && state.app_settings && state.app_settings.settings.cycles) {
      setCycles(state.app_settings.settings.cycles);
      if (!props.value) {
        setvalue(state.app_settings.settings.current_cycle);
        if (props.onChange) {
          props.onChange(state.app_settings.settings.current_cycle);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, props.value]);

  return (
    <Select
      {...props}
      onChange={val => {
        setvalue(val);
        if (props.onChange) {
          props.onChange(val);
        }
      }}
      value={value}
    >
      {cycles.map((cycle: any) => (
        <Option value={cycle.name} key={cycle.name}>
          {cycle.name}
        </Option>
      ))}
    </Select>
  );
};

export default PerfCycle;
