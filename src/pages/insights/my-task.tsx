import Chart from "react-google-charts";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import Loader from "./loader";

const MyTask: React.FC = () => {
  const [isLoading, setisLoading] = useState(true);
  const filters = useSelector((store: any) => store.FILTERS);

  const [Data, setData] = useState([["Status", "Count"]]);

  useEffect(() => {
    HttpService.get(
      "insights/my-tasks",
      {},
      {
        performance_cycle: filters.performance_cycle,
      },
    ).then(res => {
      if (res && Array.isArray(res)) {
        let data: any = [["Status", "Count"]];
        res.forEach((item: any) => {
          if (item.status === "Open") {
            data.push(["Open", parseInt(item.count, 10)]);
          } else if (item.status === "Completed") {
            data.push(["Completed", parseInt(item.count, 10)]);
          } else if (item.status === "Inprogress") {
            data.push(["Inprogress", parseInt(item.count, 10)]);
          } else if (item.status === "Overdue") {
            data.push(["Overdue", parseInt(item.count, 10)]);
          }
        });
        setData(data);
      }
      setisLoading(false);
    });
  }, [filters.performance_cycle]);

  return (
    <>
      <h4>My Task Status</h4>
      {isLoading && <Loader />}
      {!isLoading && (
        <Chart
          height={"300px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[...Data]}
          options={{
            // Just add this option
            sliceVisibilityThreshold: 0, // 20%
            pieHole: 0.4,
            legend: { position: "bottom", alignment: "center" },
          }}
          rootProps={{ "data-testid": "3" }}
        />
      )}
    </>
  );
};

export default MyTask;
