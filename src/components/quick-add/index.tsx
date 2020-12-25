import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import AppSettings from "../app-settings";

const Wrapper = styled.div`
  width: 170px;
  max-height: 300px;
  overflow-y: auto;
`;
const Item = styled.div`
  padding-left: 8px;
  border-radius: 3px;
  height: 35px;
  line-height: 35px;
  color: #000;
  &:hover {
    background: #e0e0e0c2;
  }
  &::first-letter {
    font-weight: bolder;
    font-size: 16px;
  }
`;

interface QuickAddType {
  togglePopover: Function;
}

const QuickAdd: React.FC<QuickAddType> = props => {
  return (
    <Wrapper>
      <AppSettings module="Goals">
        <div>
          <Link to="/performance/goals/new">
            <Item onClick={props.togglePopover}>Goals</Item>
          </Link>
        </div>
      </AppSettings>
      <AppSettings module="Objective">
        <div>
          <Link to="/performance/my-okrs/new">
            <Item onClick={props.togglePopover}>Objective</Item>
          </Link>
        </div>
      </AppSettings>
      <AppSettings module="Objective">
        <div>
          <Link to="/performance/checkin">
            <Item onClick={props.togglePopover}>Check In</Item>
          </Link>
        </div>
      </AppSettings>

      <AppSettings module="Tasks">
        <div>
          <Link to="/tasks/new">
            <Item onClick={props.togglePopover}>Task</Item>
          </Link>
        </div>
      </AppSettings>
    </Wrapper>
  );
};

export default QuickAdd;
