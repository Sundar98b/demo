import Chart from "react-google-charts";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import Loader from "./loader";
import NoDataCard from "../../components/no-data";

const MyTeamTask: React.FC = () => {
  const [Data, setData] = useState([
    ["Name", "Open", "Overdue", "Inprogress", "Completed"],
  ]);

  const [isEmptyData, setisEmptyData] = useState(false);

  const [isLoading, setisLoading] = useState(true);
  const filters = useSelector((store: any) => store.FILTERS);

  useEffect(() => {
    HttpService.get(
      "insights/my-team-tasks",
      {},
      {
        performance_cycle: filters.performance_cycle,
      },
    ).then(res => {
      const data = [["Name", "Open", "Overdue", "Inprogress", "Completed"]];

      const dataObj: any = {};
      if (res && Array.isArray(res) && res.length) {
        setisEmptyData(false);
        res.forEach((item: any) => {
          if (!dataObj[item.user_name]) {
            dataObj[item.user_name] = {};
          }
          dataObj[item.user_name][item.status] = parseInt(item.count, 10);
        });
      } else {
        setisEmptyData(true);
      }

      for (const person in dataObj) {
        data.push([
          person,
          dataObj[person].Open || 0,
          dataObj[person].Overdue || 0,
          dataObj[person].Inprogress || 0,
          dataObj[person].Completed || 0,
        ]);
      }
      setData(data);
      setisLoading(false);
    });
  }, [filters.performance_cycle]);

  return (
    <>
      {isEmptyData && <NoDataCard height={333} />}
      {!isEmptyData && (
        <>
          <h4>My Team Task</h4>
          {isLoading && <Loader />}
          {!isLoading && (
            <Chart
              height={"300px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={Data}
              options={{
                chartArea: { width: "50%" },
                isStacked: true,
                hAxis: {
                  title: "Total Number of Task",
                  minValue: 0,
                },
                legend: { position: "bottom", alignment: "center" },
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default MyTeamTask;
