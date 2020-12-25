import "react-circular-progressbar/dist/styles.css";

import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import CountCard from "./count-card";
import DashCard from "../../components/dash-card";
import DisciplineOfExecution from "./discipline-of-execution";
import Feeds from "./feed";
import GoalProgress from "./goal-progress";
import IsCEO from "../../components/is-ceo";
import IsManager from "../../components/is-manager";
import IsNotCEO from "../../components/is-not-ceo";
import IsUser from "../../components/is-user";
import Leaderboard from "./leaderboard";
import MyCheckins from "./my-checkin";
import MyPerformance from "./my-performance";
import MyTask from "./my-task";
import MyTeamTask from "./my-team-task";
import OperationalVsAspirational from "./operational-vs-aspirational";
import OverallDepartment from "./overall-department";
import OverallLocation from "./overall-location";
import OverallObjectiveProgress from "./overall-objective-progress";
import RootPage from "../root";

const Insights: React.FC = () => {
  const [refreshToken, setrefreshToken] = useState(0);
  return (
    <RootPage color="#f9f9f9" bg={true} topbar="insights" key={refreshToken}>
      <Row gutter={12}>
        <Col span={6} md={6} xs={24}>
          <CountCard
            color="green"
            title="Exceed"
            keys="exceed"
            url="insights/exceed"
          />
        </Col>
        <Col span={6} md={6} xs={24}>
          <CountCard
            color="amber"
            title="On Track"
            keys="on-track"
            url="insights/on-track"
          />
        </Col>
        <Col span={6} md={6} xs={24}>
          <CountCard
            color="purple"
            title="Off Track"
            url="insights/off-track"
            keys="off-track"
          />
        </Col>
        <Col span={6} md={6} xs={24}>
          <CountCard
            color="red"
            title="At Risk"
            keys="atrisk"
            url="insights/atrisk"
          />
        </Col>
      </Row>
      <IsNotCEO>
        <Row>
          <Col span={8} md={8} xs={24}>
            <DashCard>
              <MyPerformance />
            </DashCard>
          </Col>
          <Col span={8} md={8} xs={24}>
            <DashCard>
              <OperationalVsAspirational key={v4()} />
            </DashCard>
          </Col>
          <Col span={8} md={8} xs={24}>
            <DashCard>
              <Feeds />
            </DashCard>
          </Col>
        </Row>
      </IsNotCEO>

      <IsCEO>
        <Row>
          <Col span={8} md={8} xs={24}>
            <DashCard>
              <GoalProgress key={v4()} />
            </DashCard>
          </Col>
          <Col span={8} md={8} xs={24}>
            <DashCard>
              <OverallObjectiveProgress key={v4()} />
            </DashCard>
          </Col>
          <Col span={8} md={8} xs={24}>
            <DashCard>
              <OperationalVsAspirational key={v4()} />
            </DashCard>
          </Col>
        </Row>
      </IsCEO>

      {/* <IsCEO>
        <Row>
          <Col xs={24} span={12} md={12}>
            <DashCard>
              <OverallLocation key={v4()} />
            </DashCard>
          </Col>
          <Col xs={24} span={12} md={12}>
            <DashCard>
              <OverallDepartment key={v4()} />
            </DashCard>
          </Col>
        </Row>
      </IsCEO> */}
      {/* <IsManager>
        <Row>
          <Col xs={24} md={12} span={12}>
            <DashCard>
              <Leaderboard key={v4()} />
            </DashCard>
          </Col>
          <Col xs={24} md={12} span={12}>
            <DashCard>
              <DisciplineOfExecution key={v4()} />
            </DashCard>
          </Col>
        </Row>
      </IsManager> */}

      <Row>
        <Col xs={24} span={6} md={6}>
          <DashCard>
            <MyTask />
          </DashCard>
        </Col>
        <Col xs={24} span={18} md={18}>
          <IsManager>
            <DashCard>
              <MyTeamTask />
            </DashCard>
          </IsManager>
          <IsUser>
            <DashCard>
              <MyCheckins width={"100%"} height={300} />
            </DashCard>
          </IsUser>
        </Col>
      </Row>
      <IsManager>
        <Row>
          <Col xs={24} span={24} md={24}>
            <DashCard>
              <MyCheckins width={"100%"} height={300} />
            </DashCard>
          </Col>
        </Row>
      </IsManager>
    </RootPage>
  );
};

export default Insights;
