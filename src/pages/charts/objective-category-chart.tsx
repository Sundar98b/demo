import React from "react";
import { PieChart } from "@opd/g2plot-react";

interface ObjectiveCategoryProps {
  category: string;
  count: number;
}
interface Props {
  data: any;
}
export default function ObjectiveCategoryChart(props: Props) {
  const dataConfig: any = {
    forceFit: true,
    title: {
      visible: true,
      text: "Objective Category",
      alignTo: "middle",
    },
    description: {
      visible: true,
      text: "",
    },
    radius: 0.75,
    angleField: "count",
    colorField: "category",
    label: {
      visible: true,
      type: "inner",
    },
    legend: {
      visible: true,
      position: "bottom-center",
    },
    renderer: "svg",
  };
  return (
    <div>
      <PieChart {...dataConfig} data={props.data} />
    </div>
  );
}
