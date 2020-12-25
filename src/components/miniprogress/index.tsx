import React, { useEffect } from "react";
import { Progress } from "antd";
import { v4 } from "uuid";

import Utils from "../../utils";
import { PropgressWrapper } from "../progress";

export interface MiniProgressProps {
  percent: number;
}

const MiniProgress: React.FC<MiniProgressProps> = ({ percent }) => {
  const id = v4();
  useEffect(() => {
    if (document.querySelector("#pref-" + id + " .ant-progress-text")) {
      const ele = document.querySelector(
        "#pref-" + id + " .ant-progress-text",
      ) as any;
      ele.innerHTML = percent + "%";
    }
  }, [id, percent]);
  return (
    <PropgressWrapper
      style={{ display: "block" }}
      id={"pref-" + id}
      className={Utils.redAmberGreen(percent)}
      progress={percent}
    >
      <Progress
        percent={percent}
        strokeColor={Utils.redAmberGreenStroke(percent)}
      />
    </PropgressWrapper>
  );
};

export default MiniProgress;
