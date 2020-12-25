import Chart from "react-google-charts";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import Loader from "./loader";
import NoDataCard from "../../components/no-data";

interface MyCheckins {
  width: number | string;
  height: number;
}
const MyCheckins: React.FC<MyCheckins> = props => {
  const [isLoading, setisLoading] = useState(true);
  const filters = useSelector((store: any) => store.FILTERS);

  const [Data, setData] = useState([["Count", "Score"]]);
  const [isEmptyData, setisEmptyData] = useState(false);

  useEffect(() => {
    HttpService.get(
      "insights/my-checkins",
      {},
      { performance_cycle: filters.performance_cycle },
    ).then(res => {
      const data: any = [];
      data.push(["Count", "Score"]);
      setisLoading(false);
      if (res && res.length) {
        res.forEach((item: any, index: number) => {
          data.push([index + 1, item.score]);
        });
        setData(data);
        setisEmptyData(false);
      } else {
        setisEmptyData(true);
      }
    });
  }, [filters.performance_cycle]);
  return (
    <div>
      {isEmptyData && <NoDataCard height={props.height} />}
      {!isEmptyData && (
        <>
          {isLoading && <Loader />}
          {!isLoading && (
            <>
              <Chart
                width={props.width}
                height={props.height}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={Data}
                options={{
                  title: "My Checkins",
                  hAxis: {
                    title: "Count",
                    titleTextStyle: { color: "#000" },
                    gridlines: {
                      color: "transparent",
                    },
                  },
                  vAxis: {
                    minValue: 0,
                    gridlines: {
                      color: "transparent",
                    },
                  },
                  curveType: "function",
                  pointsVisible: true,
                  // For the legend to fit, we make the chart area smaller
                  chartArea: { width: "80%", height: "80%" },
                  legend: { position: "none" },

                  // lineWidth: 25
                }}
                // For tests
                rootProps={{ "data-testid": "1" }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyCheckins;
