import React from "react";
import faker from "faker";
import { Chart } from "react-google-charts";

import Utils from "../../utils";

const data: any = [["Location", "Performance", { role: "style" }]];

for (let index = 0; index < 10; index++) {
  const color = Utils.classicColors[index]
    ? Utils.classicColors[index]
    : faker.internet.color();
  data.push([
    faker.address.city(),
    faker.random.number(120),
    "color : " + color,
  ]);
}

const OverallLocation: React.FC = () => {
  return (
    <Chart
      height={"300px"}
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        // Material design options
        chart: {
          title: "Location wise performance",
        },
        bar: { groupWidth: "95%" },
        bars: "verticial",
        legend: { position: "none" },
      }}
    />
  );
};

export default OverallLocation;
