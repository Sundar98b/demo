import React from "react";
import styled from "styled-components";
import { Tabs } from "antd";

import Band from "./band";
import BusinessUnit from "./business-unit";
import CostCenter from "./cost-center";
import Departments from "./departments";
import Designation from "./designation";
import LineOfBusiness from "./line-of-business";
import Location from "./location";
import Rolecheck from "../../components/role-check";
import Roles from "./userroles";
import UnitOfMeasurements from "./unit-of-measurements";

const Wrapper = styled.div`
  .search-wrapper {
    top: 58px;
  }
`;

const { TabPane } = Tabs;
const Organizationsetup: React.FC = () => {
  return (
    <Rolecheck module="Organization Setup" fullpage>
      <Wrapper>
        <Tabs>
          <TabPane tab="Band" key="band">
            <Band />
          </TabPane>
          <TabPane tab="Business Unit" key="businessunit">
            <BusinessUnit />
          </TabPane>
          <TabPane tab="Cost Center" key="costcenter">
            <CostCenter />
          </TabPane>
          <TabPane tab="Departments" key="department">
            <Departments />
          </TabPane>
          <TabPane tab="Designation" key="designation">
            <Designation />
          </TabPane>
          <TabPane tab="Line Of Business" key="LineOfBusiness">
            <LineOfBusiness />
          </TabPane>
          <TabPane tab="Location" key="Location">
            <Location />
          </TabPane>
          <TabPane tab="Role" key="Role">
            <Roles />
          </TabPane>
          <TabPane tab="Unit Of Measurements" key="UnitOfMeasurements">
            <UnitOfMeasurements />
          </TabPane>
        </Tabs>
      </Wrapper>
    </Rolecheck>
  );
};

export default Organizationsetup;
