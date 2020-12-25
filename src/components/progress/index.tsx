import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import { v4 } from "uuid";

import Utils from "../../utils";

interface ProgressBar {
  progress: number | string;
  type?: string;
}
export const PropgressWrapper = styled.div`
  display: inline-block;

  &.text-red {
    .anticon-check {
      display: none !important;
    }
  }

  .ant-progress-text {
    color: #52c41a;
    font-size: 8px !important;
    left: 54%;
  }

  &.green {
    .ant-progress-text {
      color: #43a047 !important;
    }
  }
  &.red {
    .ant-progress-text {
      color: #e53935 !important;
    }
  }
  &.amber {
    .ant-progress-text {
      color: #fb8c00 !important;
    }
  }
`;

const ProgressBar: React.FC<ProgressBar> = props => {
  const [ProgressData, setProgressData] = useState(0);
  const id = v4();

  useEffect(() => {
    if (document.querySelector("#pref-" + id + " .ant-progress-text")) {
      const ele = document.querySelector(
        "#pref-" + id + " .ant-progress-text",
      ) as any;
      ele.innerHTML = props.progress + "%";
    }

    // @ts-ignore
    const progress = Math.round(parseInt(props.progress, 10));
    setProgressData(progress);
  }, [props, id]);

  return (
    <PropgressWrapper
      id={"pref-" + id}
      className={Utils.redAmberGreen(ProgressData)}
      progress={ProgressData}
    >
      <Progress
        width={28}
        showInfo={true}
        strokeColor={Utils.redAmberGreenStroke(ProgressData)}
        type="dashboard"
        percent={ProgressData}
      />
    </PropgressWrapper>
  );
};
ProgressBar.defaultProps = {
  type: "dashboard",
} as Partial<ProgressBar>;
export default ProgressBar;
