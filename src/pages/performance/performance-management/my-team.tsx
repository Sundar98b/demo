import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Col, Progress, Row } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import EditRating from "./edit-rating";
import HttpService from "../../../services/httpService";
import SKLoader from "../../../components/skloader";
import UserChip from "../../../components/user-chip";

const redAmberGreen = (str: number) => {
  if (str >= 0 && str <= 39) {
    return "red";
  } else if (str >= 40 && str <= 69) {
    return "#ffa726";
  } else if (str >= 70) {
    return "#43a047";
  }
};

const ProgressCss = styled.div`
  .ant-progress-line {
    //left: 15px;
    width: 80%;
  }
  .ant-progress-bg {
    height: 16px !important;
  }
  .ant-progress-text {
    display: inline-block;
    width: 2em;
    margin-left: 2px;
    color: ${props => redAmberGreen(props.progressColor)};
    font-size: 1em;
    line-height: 1;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    word-break: normal;
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 5px 12px;
  height: 55px;
  .lazy-img {
    border-radius: 50%;
    width: auto;
    height: 41px;
    width: 41px;
  }
  .anticon {
    font-size: large;
  }
`;
const Name = styled.strong`
  cursor: pointer;
`;

const Wrapper = styled.div`
  overflow-y: auto;
  height: 68vh;
  .ant-timeline-item-tail {
    border-color: #c3c3c3;
  }
  .ant-tag {
    cursor: pointer;
  }
  .ant-row {
    //border: 1px solid black;
    width: 100%;
    margin: 3px auto;
  }
  .ant-col {
    margin: auto 0px;
    //border: 1px solid red;
    //font-weight: 600;
    color: #000000;
    overflow: hidden;
    //text-align: left;
  }
`;
const Padder = styled.div`
  margin: 6px auto;
`;

const PRMyTeamView: React.FC = () => {
  const [isLoaded, setisLoaded] = useState(false);
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [loggedInUser, setLoggedInUser] = useState<any>(undefined);
  const [appCycle, setAppCycles] = useState<any>([]);
  const [CurrentTimeline, setCurrentTimeline] = useState<any>("");
  const [prSettings, setPrSettings] = useState<any>(undefined);
  const [selectedCycle, setSelectedCycle] = useState<any>(undefined);
  const [reviewCycle, setReviewCycle] = useState<any>(undefined);
  const [Team, setTeam] = useState([]);
  const [CurrentCycle, setCurrentCycle] = useState();
  const [ModalVisible, setModalVisible] = useState(false);
  const [Users, setUsers] = useState<any>(undefined);
  const [addHelper, setAddHelper] = useState<any>({});

  useEffect(() => {
    if (state && state.app_settings && state.app_settings.settings.cycles) {
      setAppCycles(state.app_settings.settings.cycles);
    }
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    setCurrentTimeline(filter.performance_cycle);
    setPrSettings(state?.prSettings ?? undefined);
    setLoggedInUser(state?.user ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    console.log(`appCycle: ${JSON.stringify(appCycle)}`);
    let selectedCycle: any = undefined;
    appCycle.forEach((item: any) => {
      if (item.name === CurrentTimeline) {
        selectedCycle = item;
      }
    });
    setSelectedCycle(selectedCycle);
    console.log(`selectedCycle: ${JSON.stringify(selectedCycle)}`);
  }, [appCycle, CurrentTimeline]);

  useEffect(() => {
    let tempReviewTimelineName: any = undefined;
    if (selectedCycle && prSettings?.review_timeline?.timeline?.cycles) {
      let cycleStart: any = selectedCycle;
      let tempReviewTimeline: any =
        prSettings?.review_timeline?.timeline?.cycles ?? undefined;
      tempReviewTimeline.map((item: any) => {
        const cycStartDate: any = moment(cycleStart?.start);
        const start: any = moment(item?.start);
        const end: any = moment(item?.end);
        if (cycStartDate >= start && cycStartDate <= end) {
          tempReviewTimelineName = item.name;
        }
      });
      setReviewCycle(tempReviewTimelineName);
    }
  }, [selectedCycle, prSettings]);

  const getTeam = (id: string, isDrill: boolean) => {
    let newData: any = [];
    if (id && reviewCycle) {
      HttpService.get(
        "performance/team/performance-review-rating",
        {},
        {
          line_manager: id,
          review_cycle: reviewCycle,
        },
      )
        .then(response => {
          if (!isDrill) {
            response?.map((item: any) => {
              newData.push(item);
            });
            setTeam(newData);
          } else {
            let exisitingData: any = [...Team];
            let tempNewData: any = [];
            response?.map((item: any) => {
              tempNewData.push(item);
            });
            let managerIndex: any = undefined;
            exisitingData?.map((item: any, index: number) => {
              if (item.user_id === id) {
                managerIndex = index;
              }
            });
            console.log(`manager Index: ${managerIndex}`);
            console.log(`child data: ${JSON.stringify(tempNewData)}`);
            exisitingData.splice(managerIndex + 1, 0, ...tempNewData);
            console.log(`new data: ${JSON.stringify(exisitingData)}`);
            setTeam(exisitingData);
          }
        })
        .finally(() => {
          setisLoaded(true);
        });
    }
  };

  useEffect(() => {
    if (state?.user?.id && reviewCycle) {
      getTeam(state?.user?.id, false);
    }
  }, [reviewCycle]);

  const openModal = (item: any) => {
    setUsers(item);
    setModalVisible(true);
  };
  const openDrill = (id: string) => {
    getTeam(id, true);
  };

  const onModalClose = () => {
    setModalVisible(false);
    if (state?.user?.id && reviewCycle) {
      getTeam(state?.user?.id, false);
      setAddHelper({});
    }
  };

  return (
    <>
      {ModalVisible && <EditRating onModalClose={onModalClose} data={Users} />}
      {!isLoaded && <SKLoader />}
      {isLoaded && !ModalVisible && (
        <Wrapper>
          <Card>
            <Row>
              <Col span={1}></Col>
              <Col span={23}>
                <Row justify={"space-around"}>
                  <Col span={4}>
                    <b>Department</b>
                  </Col>
                  <Col span={3}>
                    <b>Emp No</b>
                  </Col>
                  <Col span={4}>
                    <b>Name</b>
                  </Col>
                  <Col span={3}>
                    <b>Performance</b>
                  </Col>
                  <Col span={3}>
                    <b>Competence</b>
                  </Col>
                  <Col span={3}>
                    <b>Overall</b>
                  </Col>
                  <Col span={3}>
                    <b>My Rating</b>
                  </Col>
                  <Col span={1}></Col>
                </Row>
              </Col>
            </Row>
            &nbsp;
            {Team &&
              Team.map((item: any, index: number) => (
                <>
                  <Row key={index}>
                    <Col span={1}>
                      {item.no_of_reportees > 0 && !addHelper[item.user_id] && (
                        <PlusCircleOutlined
                          onClick={() => {
                            openDrill(item.user_id);
                            let tempHelper: any = { ...addHelper };
                            tempHelper[item.user_id] = true;
                            setAddHelper(tempHelper);
                          }}
                        />
                      )}
                    </Col>
                    <Col span={23}>
                      <Row justify={"space-around"}>
                        <Col span={4}>{item.department_name ?? "N/A"}</Col>
                        <Col span={3}>{item.employee_id ?? "N/A"}</Col>
                        <Col span={4}>
                          <UserChip
                            name={item?.display_name ?? "N/A"}
                            img={item?.profile_photo ?? undefined}
                          />
                        </Col>
                        <Col span={3}>
                          <ProgressCss progressColor={item?.sys_calc_okr ?? 0}>
                            <Progress
                              format={percent => `${percent}%`}
                              percent={Math.round(item?.sys_calc_okr ?? 0)}
                              type="line"
                              strokeColor={redAmberGreen(
                                item?.sys_calc_okr ?? 0,
                              )}
                            />
                          </ProgressCss>
                        </Col>
                        <Col span={3}>
                          <ProgressCss
                            progressColor={item?.sys_calc_competence ?? 0}
                          >
                            <Progress
                              format={percent => `${percent}%`}
                              percent={Math.round(
                                item?.sys_calc_competence ?? 0,
                              )}
                              type="line"
                              strokeColor={redAmberGreen(
                                item?.sys_calc_competence ?? 0,
                              )}
                            />
                          </ProgressCss>
                        </Col>
                        <Col span={3}>
                          <ProgressCss
                            progressColor={item?.sys_calc_overall ?? 0}
                          >
                            <Progress
                              format={percent => `${percent}%`}
                              percent={Math.round(item?.sys_calc_overall ?? 0)}
                              type="line"
                              strokeColor={redAmberGreen(
                                item?.sys_calc_overall ?? 0,
                              )}
                            />
                          </ProgressCss>
                        </Col>
                        <Col span={3}>
                          <ProgressCss
                            progressColor={item?.prrl_review_rating ?? 0}
                          >
                            <Progress
                              format={percent => `${percent}%`}
                              percent={Math.round(
                                item?.prrl_review_rating ?? 0,
                              )}
                              type="line"
                              strokeColor={redAmberGreen(
                                item?.prrl_review_rating ?? 0,
                              )}
                            />
                          </ProgressCss>
                        </Col>
                        <Col span={1}>
                          <EditOutlined onClick={() => openModal(item)} />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  &nbsp;
                </>
              ))}
          </Card>
        </Wrapper>
      )}
    </>
  );
};

export default PRMyTeamView;
