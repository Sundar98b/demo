import Chart from "react-google-charts";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import Loader from "./loader";
import NoDataCard from "../../components/no-data";

const Wrapper = styled.div`
  height: 213px;
  svg {
    height: 82%;
  }
`;

const OperationalVsAspirational: React.FC = () => {
  const [isLoading, setisLoading] = useState(true);

  const [operational, setoperational] = useState(0);
  const [aspirational, setaspirational] = useState(0);
  const filters = useSelector((store: any) => store.FILTERS);
  const [isDataEmpty, setisDataEmpty] = useState(false);
  useEffect(() => {
    HttpService.get(
      "insights/categories",
      {},
      {
        performance_cycle: filters.performance_cycle,
        users: filters.users,
        department: filters.department,
      },
    ).then(res => {
      setoperational(res.operational || 0);
      setaspirational(res.aspirational || 0);
      setisLoading(false);
      if (!res.operational && !res.aspirational) {
        setisDataEmpty(true);
      } else {
        setisDataEmpty(false);
      }
    });
  }, [filters.department, filters.performance_cycle, filters.users]);

  return (
    <Wrapper>
      {isDataEmpty && <NoDataCard height={153} />}

      {!isDataEmpty && (
        <>
          <h3>Operational vs Aspirational</h3>
          {isLoading && <Loader />}
          {!isLoading && (
            <Chart
              height={"200px"}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["Category", "Count"],
                ["Operational", operational],
                ["Aspirational", aspirational],
              ]}
              options={{
                // Just add this option
                sliceVisibilityThreshold: 0, // 20%
                legend: { position: "right", alignment: "center" },
                slices: {
                  0: { color: "#FF8A29" },
                  1: { color: "#EE4327" },
                },
              }}
              rootProps={{ "data-testid": "3" }}
            />
          )}
        </>
      )}
    </Wrapper>
  );
};

export default OperationalVsAspirational;
