import React from "react";
import faker from "faker";
import { Chart } from "react-google-charts";

const OverallDepartment: React.FC = () => {
  const data: any = [["Department", "Performance"]];

  for (let index = 0; index < faker.random.number(30); index++) {
    data.push([faker.address.city(), faker.random.number(120)]);
  }
  return (
    <Chart
      height={"300px"}
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        // Material design options
        chart: {
          title: "Department wise performance",
          alignment: "center",
        },
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
      }}
    />
  );
};

export default OverallDepartment;
