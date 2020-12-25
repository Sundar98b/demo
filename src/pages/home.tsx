//@ts-nocheck
/* import-sort-ignore */
import { Calendar, Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import GoalChart from "./charts/goal-chart";
import HttpService from "../services/httpService";
import ObjectivesChart from "./charts/objectives-chart";
import RootPage from "./root";
import Utils from "../utils";
import styled from "styled-components";
import { useSelector } from "react-redux";

// import Leaderboard from "./charts/leaderboard";
const { xs } = Utils.MediaQuery;

const ColWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 88vh;
  ${xs} {
    /* height:90vh; */
  }
`;
const Loader = styled.div`
  height: 100px;
  margin: 0;
`;
const ChartCard = styled.div`
  padding: 15px;
  border: 1px solid
    ${props =>
      props.bg ? props.bg : "linear-gradient(to right, #d53369, #cbad6d)"};
  background: ${props =>
    props.bg ? props.bg : "linear-gradient(to right, #d53369, #cbad6d)"};
  color: #fff;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 5px;
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  .title {
    font-size: 0.8em;
  }
  .value {
    padding: 10px 0;
    font-size: 1.5em;
  }
  &.red {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(244, 67, 54, 0.4);
    background: linear-gradient(60deg, #ef5350, #e53935);
  }
  &.green {
    background: linear-gradient(60deg, #66bb6a, #43a047);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(76, 175, 80, 0.4);
  }
  &.amber {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(255, 152, 0, 0.4);
    background: linear-gradient(60deg, #ffa726, #fb8c00);
  }
`;

const Purple = styled(ChartCard)`
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
    0 7px 10px -5px rgba(156, 39, 176, 0.4);
  background: linear-gradient(60deg, #ab47bc, #8e24aa);
`;
const Blue = styled(ChartCard)`
  background: linear-gradient(60deg, #26c6da, #00acc1);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
    0 7px 10px -5px rgba(0, 188, 212, 0.4);
`;
interface BulletChartDataProps {
  title: string;
  progress: number;
}
const HomePage: React.FC = () => {
  const state = useSelector((store: any) => store.INITIAL_DATA);

  const [overallgoalsdata, setoverallgoalsData] = useState<number>(0);
  const [aspirationalobjectivedata, setaspirationalobjectiveData] = useState<
    number
  >(0);
  const [operationalobjectivedata, setoperationalobjectiveData] = useState<
    number
  >(0);
  const [goalsdata, setGoalsData] = useState<BulletChartDataProps[]>([]);
  const [overallOwnObjectivesdata, setOverallOwnObjectivesdata] = useState<
    number
  >(0);
  const [ownObjectivesdata, setOwnObjectivesdata] = useState<
    BulletChartDataProps[]
  >([]);

  const getGoals = () => {
    HttpService.get("goals")
      .then(res => {
        const chartValues: any = [];
        res?.data?.map((item: any) => {
          const numstr = Number(item.performance ?? 0).toString();

          const perform: any = parseInt(numstr);

          let perfomrance = perform ? Utils.round(perform) : 0;
          if (typeof perfomrance === "string") {
            perfomrance = parseInt(perfomrance);
          }
          chartValues.push({
            title: item.description,
            data: perfomrance,
          });
        });

        setGoalsData([...chartValues]);
        setannual_goals(true);
      })
      .catch(err => {});
  };
  const getOverallGoals = () => {
    HttpService.get("goals")
      .then(res => {
        let goalProgress: number[] = [];
        res?.data?.map((item: any) => {
          if (item.performance) {
            goalProgress.push(parseInt(item.performance));
          } else {
            goalProgress.push(0);
          }
        });
        let total = 0;
        for (const item of goalProgress) {
          if (typeof item === "string") {
            total += parseInt(item, 10);
          } else if (typeof item === "number") {
            total += item;
          }
        }
        setoverallgoalsData(total);
        setoverall_goal(true);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getOwnObjectives = () => {
    HttpService.get("objectives/own")
      .then(res => {
        const chartValues: any = [];
        res?.map((item: any) => {
          chartValues.push({
            title: item.description,
            data: item.progress,
          });
        });
        setOwnObjectivesdata([...chartValues]);
        setobjective(true);
      })
      .catch(err => {});
  };
  const getOverallObjectivesCategoryCount = () => {
    HttpService.get("objectives/category-count")
      .then(serverData => {
        serverData?.map((item: any) => {
          if (item["category"] === "operational") {
            if (typeof item["count"] === "string") {
              setoperationalobjectiveData(parseInt(item["count"]));
            } else {
              setoperationalobjectiveData(item["count"]);
            }
          } else if (item["category"] === "aspirational") {
            if (typeof item["count"] === "string") {
              setaspirationalobjectiveData(parseInt(item["count"]));
            } else {
              setaspirationalobjectiveData(item["count"]);
            }
          }
        });
        setaspirational(true);
        setoperational(true);
        setobjectiveCategoryData(temp);
      })
      .catch(err => {});
  };
  const getOverallOwnObjectives = () => {
    HttpService.get("objectives/own")
      .then(res => {
        let progress = 0;
        res?.map((item: any) => {
          progress += item.completed_weightage ?? 0;
        });
        let total =
          res && res.length > 0 && progress ? progress / res.length : 0;

        setOverallOwnObjectivesdata(Utils.round(total));
        setoverall_objective(true);
      })
      .catch(err => {});
  };
  useEffect(() => {
    getGoals();
    getOverallGoals();
    getOverallOwnObjectives();
    getOwnObjectives();
    getOverallObjectivesCategoryCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loader_overall_goal, setoverall_goal] = useState(false);
  const [loader_overall_objective, setoverall_objective] = useState(false);
  const [loader_aspirational, setaspirational] = useState(false);
  const [loader_operational, setoperational] = useState(false);
  const [loader_annual_goals, setannual_goals] = useState(false);
  const [loader_objective, setobjective] = useState(false);

  return (
    <RootPage bg={true} topbar="insights" hideOverflow={true}>
      <Row gutter={8}>
        <Col span={16} xs={24} md={16}>
          <ColWrapper>
            <Row gutter={[8, 8]}>
              {state?.product_settings?.settings?.Goals &&
                (state?.roles?.name === "Product Admin" ||
                  state?.roles?.name === "Org Admin") && (
                  <Col span={6}>
                    {loader_overall_goal && (
                      <ChartCard
                        className={Utils.redAmberGreen(
                          Math.round(overallgoalsdata),
                        )}
                      >
                        <div className="title">Goals Overall</div>
                        <div className="value">
                          {Math.round(overallgoalsdata)} %
                        </div>
                      </ChartCard>
                    )}
                    {!loader_overall_goal && <Loader className="skleton" />}
                  </Col>
                )}
              {state?.product_settings?.settings?.Objective && (
                <Col span={6}>
                  {!loader_overall_objective && <Loader className="skleton" />}
                  {loader_overall_objective && (
                    <ChartCard
                      className={Utils.redAmberGreen(
                        Math.round(overallOwnObjectivesdata),
                      )}
                    >
                      <div className="title">Objectives Overall</div>
                      <div className="value">
                        {Math.round(overallOwnObjectivesdata)} %
                      </div>
                    </ChartCard>
                  )}
                </Col>
              )}
              {state?.product_settings?.settings?.Objective && (
                <Col span={6}>
                  {!loader_aspirational && <Loader className="skleton" />}
                  {loader_aspirational && (
                    <Purple>
                      <div className="title">Aspirational</div>
                      <div className="value">
                        {Math.round(aspirationalobjectivedata)}
                      </div>
                    </Purple>
                  )}
                </Col>
              )}
              {state?.product_settings?.settings?.Objective && (
                <Col span={6}>
                  {!loader_operational && <Loader className="skleton" />}
                  {loader_operational && (
                    <Blue>
                      <div className="title">Operational</div>
                      <div className="value">
                        {Math.round(operationalobjectivedata)}
                      </div>
                    </Blue>
                  )}
                </Col>
              )}
              {state?.product_settings?.settings?.Goals &&
                (state?.roles?.name === "Product Admin" ||
                  state?.roles?.name === "Org Admin") && (
                  <Col span={22} offset={1}>
                    {!loader_annual_goals && (
                      <>
                        <h3 align="center">Annual Goals</h3>

                        <Loader
                          className="skleton"
                          style={{ height: 20, margin: "5px 0" }}
                        />
                        <Loader
                          className="skleton"
                          style={{ height: 20, margin: "5px 0" }}
                        />
                        <Loader
                          className="skleton"
                          style={{ height: 20, margin: "5px 0" }}
                        />
                        <Loader
                          className="skleton"
                          style={{ height: 20, margin: "5px 0" }}
                        />
                      </>
                    )}
                    {loader_annual_goals && <GoalChart data={goalsdata} />}
                  </Col>
                )}

              {state?.product_settings?.settings?.Objective && (
                <Col span={22} offset={1}>
                  {!loader_objective && (
                    <>
                      <h3 align="center">Objectives Progress</h3>
                      <Loader
                        className="skleton"
                        style={{ height: 20, margin: "5px 0" }}
                      />
                      <Loader
                        className="skleton"
                        style={{ height: 20, margin: "5px 0" }}
                      />
                      <Loader
                        className="skleton"
                        style={{ height: 20, margin: "5px 0" }}
                      />
                      <Loader
                        className="skleton"
                        style={{ height: 20, margin: "5px 0" }}
                      />
                    </>
                  )}
                  {loader_objective && (
                    <ObjectivesChart data={ownObjectivesdata} />
                  )}
                </Col>
              )}
              {/* <Col span={22} offset={1}>
                <Leaderboard />
              </Col> */}
            </Row>
            <p>&nbsp;</p>
          </ColWrapper>
        </Col>
        <Col span={8} md={8} xs={24}>
          <ColWrapper>
            <Calendar fullscreen={false} />
          </ColWrapper>
        </Col>
      </Row>
    </RootPage>
  );
};

export default HomePage;
