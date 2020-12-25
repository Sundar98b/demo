import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import HttpService from "../../services/httpService";
import Loader from "./loader";
import Utils from "../../utils";

const Wrapper = styled.div`
  font-weight: bold;
  text-align: center;
  .ant-progress-text {
    font-size: 16px;
  }
  .ant-progress-status-success .ant-progress-text {
    color: #000;
  }
`;

const OverallObjectiveProgress: React.FC = () => {
  const [ProgressData, setProgressData] = useState(0);
  const [isLoading, setisLoading] = useState(true);

  const filters = useSelector((store: any) => store.FILTERS);
  useEffect(() => {
    HttpService.get(
      "insights/objectives",
      {},
      {
        performance_cycle: filters.performance_cycle,
      },
    ).then(res => {
      setisLoading(false);
      if (res && res.objectives) {
        setProgressData(res.objectives);
      } else {
        setProgressData(0);
      }
    });
  }, [filters.performance_cycle]);
  const id = v4();

  useEffect(() => {
    if (document.querySelector("#pref-" + id + " .ant-progress-text")) {
      const ele = document.querySelector(
        "#pref-" + id + " .ant-progress-text",
      ) as any;
      ele.innerHTML = Utils.round(ProgressData + "") + "%";
      console.log(ele)
      console.log(ProgressData)
    }
  }, [ProgressData, id]);

  return (
    <>
      <Wrapper id={"pref-" + id}>
        <h3>Overall Objective Progress</h3>
        {isLoading && <Loader />}
        {!isLoading && (
          <Progress
            percent={Utils.round(ProgressData + "")}
            strokeWidth={12}
            type="dashboard"
            width={180}
            strokeColor={{
              "0%": "#5d7cef",
              "100%": "#e35767",
            }}
          />
        )}
      </Wrapper>
    </> 
  );
};

export default OverallObjectiveProgress;
