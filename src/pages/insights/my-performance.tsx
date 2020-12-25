import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import HttpService from "../../services/httpService";
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

const MyPerformance: React.FC = () => {
  const filters = useSelector((store: any) => store.FILTERS);

  useEffect(() => {
    HttpService.get(
      "insights/my-performance",
      {},
      { performance_cycle: filters.performance_cycle },
    ).then(res => {
      if (res.performance) {
        setProgressData(res.performance);
      } else {
        setProgressData(0);
      }
    });
  }, [filters.performance_cycle]);

  const [ProgressData, setProgressData] = useState(0);

  const id = v4();

  useEffect(() => {
    if (document.querySelector("#pref-" + id + " .ant-progress-text")) {
      const ele = document.querySelector(
        "#pref-" + id + " .ant-progress-text",
      ) as any;
      ele.innerHTML = Utils.round(ProgressData + "") + "%";
    }
  }, [ProgressData, id]);

  return (
    <>
      <Wrapper id={"pref-" + id}>
        <h3>My Performance</h3>
        <Progress
          percent={Utils.round(ProgressData + "")}
          strokeWidth={12}
          width={180}
          type="dashboard"
          strokeColor={{
            "0%": "#5d7cef",
            "100%": "#e35767",
          }}
        />
      </Wrapper>
    </>
  );
};

export default MyPerformance;
