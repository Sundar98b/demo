import styled from "styled-components";
import useMobileDetect from "use-mobile-detect-hook";
import React, { useEffect, useState } from "react";
import { Avatar, Radio, notification } from "antd";
import { useSelector } from "react-redux";

import CrossTeam from "../../../../assets/cross-team.svg";
import Org from "../../../../assets/org.svg";
import Select2 from "../../../../components/select2";
import Team from "../../../../assets/team.svg";
import User from "../../../../assets/user2.svg";
import Utils from "../../../../utils";

const { xs } = Utils.MediaQuery;
interface ObjectiveType {
  onSelect: Function;
  profile: string;
  NameFirstLetter: string;
  isManager: boolean;
  isSecondManager: boolean;
  selectedObjType?: string;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .ant-radio-wrapper {
    padding: 5px;
    border-radius: 4px;
    &:hover {
      border: 1px solid #1890ff;
      background: rgba(244, 250, 255, 0.5294117647058824);
      line-height: 42px !important;
    }
    &:nth-child(2) {
      &:hover {
        border: 1px solid #9c27b0;
        background: rgba(156, 39, 176, 0.1);
        line-height: 38px !important;
      }
    }
    &:nth-child(3) {
      &:hover {
        border: 1px solid #009688;
        background: rgba(0, 150, 136, 0.1);
        line-height: 37px !important;
      }
    }
    &:nth-child(4) {
      &:hover {
        border: 1px solid #ff5722;
        background: rgba(255, 87, 34, 0.05);
        line-height: 42px !important;
      }
    }
  }
  .card {
    width: 700px;

    border: 1px solid #707070;
    min-height: 100px;
    background: #fff;
    padding: 20px;
    ${xs} {
      width: 98vw;
      margin: 0 auto;
    }
  }
`;
const radioStyle = {
  display: "block",
  height: "50px",
  lineHeight: "50px",
};

const radioStyle2 = {
  display: "block",
  height: "50px",
  lineHeight: "50px",
};

const ObjectiveType: React.FC<ObjectiveType> = props => {
  const [GoalID, setGoalID] = useState("");
  const [SelectedType, setSelectedType] = useState("");
  const detectMobile = useMobileDetect();
  const [IsGoalEnable, setIsGoalEnable] = useState(false);
  const store = useSelector((store: any) => store.INITIAL_DATA);

  useEffect(() => {
    setIsGoalEnable(!!store?.product_settings?.settings?.Goals);
  }, [store]);

  useEffect(() => {
    if (props?.selectedObjType) {
      setSelectedType(props?.selectedObjType);
    }
  }, [props?.selectedObjType]);

  useEffect(() => {
    console.log(`selected type: ${SelectedType}`);
    if (SelectedType !== "org") {
      props.onSelect({
        type: SelectedType,
        goal_id: 0,
      });
    } else if (GoalID) {
      props.onSelect({
        goal_id: GoalID,
        type: SelectedType,
      });
    } else {
      notification.error({
        message: "Error",
        description: "Please select a goal",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GoalID, SelectedType]);

  const onGoalChange = (value: any) => {
    setGoalID(value);
  };
  const onSelect = (e: any) => {
    setSelectedType(e.target.value);
  };
  return (
    <Wrapper>
      <div className="card">
        <Radio.Group value={SelectedType} onChange={onSelect}>
          <Radio style={radioStyle} value="own">
            <Avatar src={User} shape="square" />
            My Objective
          </Radio>
          {props.isManager && (
            <Radio style={radioStyle} value="team">
              <Avatar src={Team} shape="square" /> My Team
            </Radio>
          )}
          {props.isSecondManager && (
            <Radio style={radioStyle} value="cross_team">
              <Avatar src={CrossTeam} shape="square" /> Cross Functional Team
            </Radio>
          )}
          {IsGoalEnable && (
            <Radio style={radioStyle2} value="org">
              <Avatar src={Org} shape="square" />
              My Organisation
              <Select2
                onChange={onGoalChange}
                entity="goals"
                entity_id="description"
                style={{
                  width: detectMobile.isMobile() ? "80vw" : "350px",
                  paddingLeft: detectMobile.isMobile() ? "0px" : "20px",
                  display: detectMobile.isMobile() ? "block" : "inline-block",
                }}
              />
            </Radio>
          )}
        </Radio.Group>
      </div>
    </Wrapper>
  );
};

export default ObjectiveType;
