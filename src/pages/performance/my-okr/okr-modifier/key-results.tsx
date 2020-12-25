import styled from "styled-components";
import React, { useState } from "react";
import { Progress } from "antd";

import Rolecheck from "../../../../components/role-check";
import { default as KRLists } from "./keyresults";

interface KeyResults {
  description: string;
  start: string;
  end: string;
  kpi: boolean;
  objective_id: string;
  assignRule: string;
  objectiveType: string;
  performance_cycle: string;
  user_id: string;
  cycle: string;
  user_name: string;
  items?: any[];
  isEditPage?: boolean;
}

interface KeyResultsDataType {
  description: string;
  end_date: string | null;
  is_activity: boolean;
  is_sub: boolean;
  kpi?: string;
  objective_id: string;
  start_date: string | null;
  status: string;
  uom: string;
  user_id: string;
  weightage: number | undefined;
  activity: string;
  performance_cycle: string;
  target: number | null;
  start: number | null;
}

const Wrapper = styled.div`
  margin-top: 15px;
  background: #fff;
`;
export const Obj = styled.div`
  background: #f7f7f7;
  padding: 8px;
  border: var(--light-bdr);
  font-weight: bolder;
  margin-bottom: 12px;
  position: relative;
  margin-top: 4px;
  .ant-form-item-label > label::after {
    content: "";
  }
  /* .ant-radio-group {
    position: absolute;
    right: 0;
    top: -1px;
  } */
`;
const ProgressBar = styled.div`
  width: 100px;
  float: right;
  text-align: right;
  margin-top: -6px;
  &.text-red {
    .ant-progress-text {
      color: #e53935 !important;
    }
    .ant-progress-circle-path {
      stroke: #e53935 !important;
    }
  }
`;

const initialData: KeyResultsDataType = {
  description: "",
  objective_id: "",
  user_id: "",
  start_date: null,
  end_date: null,
  start: null,
  target: null,
  is_activity: false,
  is_sub: false,
  kpi: "",
  uom: "",
  status: "",
  weightage: undefined,
  activity: "",
  performance_cycle: "",
};
const KrCards = styled.div`
  .kr-card:last-child .card:after {
    content: " ";
    width: 37px;
    height: 90%;
    background: #fff;
    position: absolute;
    top: 21px;
    left: -43px;
  }
`;
const KeyResults: React.FC<KeyResults> = props => {
  if (props.objectiveType === "own") {
    initialData.user_id = props.user_id;
  }
  const id = "mini";
  const [totalWeightage, settotalWeightage] = useState(0);

  return (
    <Wrapper>
      <Rolecheck module="Key Results" action="create">
        <div>
          <Obj>
            <ProgressBar
              id={"pref-" + id}
              className={totalWeightage > 100 ? "text-red" : ""}
            >
              {totalWeightage >= 100 && (
                <span
                  className={
                    totalWeightage > 100
                      ? "text-red prs-text"
                      : " text-green prs-text"
                  }
                >
                  {totalWeightage}%
                </span>
              )}
              <Progress type="circle" percent={totalWeightage} width={35} />
            </ProgressBar>
            {props.description}
          </Obj>
        </div>
        <KrCards>
          <KRLists
            objective_id={props.objective_id}
            cycle={props.cycle}
            performance_cycle={props.performance_cycle}
            start={props.start}
            end={props.end}
            kpi={props.kpi}
            assignRule={props.assignRule}
            objectiveType={props.objectiveType}
            user_id={props.user_id}
            weightage={(val: any) => settotalWeightage(val)}
            user_name={props.user_name}
            items={props?.items ?? undefined}
            isEditPage={props.isEditPage}
          />
        </KrCards>
      </Rolecheck>
    </Wrapper>
  );
};

KeyResults.defaultProps = {
  isEditPage: false,
} as Partial<KeyResults>;

export default KeyResults;
