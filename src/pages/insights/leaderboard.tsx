import Chart from "react-google-charts";
import React from "react";
import faker from "faker";
const Leaderboard: React.FC = () => {
  return (
    <Chart
      height={"300px"}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={[
        ["City", "Performance"],
        ["New York City, NY", faker.random.number(120)],
        ["Los Angeles, CA", faker.random.number(120)],
        ["Chicago, IL", faker.random.number(120)],
        ["Houston, TX", faker.random.number(120)],
        ["Philadelphia, PA", faker.random.number(120)],
      ]}
      options={{
        legend: { position: "none" },
        title: "Leaderboard",
        hAxis: {
          title: "Performance (%)",
          minValue: 0,
        },
        vAxis: {
          title: "Person",
        },
        bars: "horizontal",
      }}
      // For tests
      rootProps={{ "data-testid": "5" }}
    />
  );
};

export default Leaderboard;
