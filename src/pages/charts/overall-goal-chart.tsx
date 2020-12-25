import React from "react";
import { GaugeChart } from "@opd/g2plot-react";
import { GaugeConfig } from "@antv/g2plot";

interface Props {
  data: any;
}
export default function OverallGoalChart(props: Props) {
  const dataConfig: GaugeConfig = {
    title: {
      visible: true,
      text: "Overall Goal Progress",
      alignTo: "middle",
    },
    width: 300,
    height: 300,
    min: 0,
    max: 100,
    range: [0, 25, 75, 100],
    value: props.data,
    color: ["#FC6042", "#EEE657", "#2CC990"],
    statistic: {
      visible: true,
      text: props.data + "%",
      color: "#30bf78",
    },
    renderer: "svg",
  };
  return (
    <div>
      {/* <h3>Overall Goal Progress</h3> */}
      <GaugeChart {...dataConfig} />
    </div>
  );
}
