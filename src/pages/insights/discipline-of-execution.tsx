import Chart from "react-google-charts";
import React from "react";
import faker from "faker";

const DisciplineOfExecution: React.FC = () => {
  const data: any = [
    ["Name", "Exceed", "On Track", "Off Track", "At Risk"],
    ["Vijay Kumar", 100, 90, 45, 89],
    ["Naveen", 100, 90, 45, 23],
    ["Azar", 100, 90, 45, 34],
    ["Vimalan", 100, 90, 45, 90],
    ["Perumal", 100, 90, 45, 78],
  ];
  for (let index = 0; index < faker.random.number(50); index++) {
    data.push([
      faker.name.findName(),
      faker.random.number(130),
      faker.random.number(130),
      faker.random.number(130),
      faker.random.number(130),
    ]);
  }

  return (
    <>
      <Chart
        height={"300px"}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          chartArea: { width: "50%" },
          isStacked: true,
          hAxis: {
            title: "Total Number of Task",
            minValue: 0,
          },
          title: "Discipline of Execution",
          legend: { position: "bottom", alignment: "center" },
        }}
      />
    </>
  );
};

export default DisciplineOfExecution;
