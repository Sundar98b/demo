import Meta from "antd/lib/card/Meta";
import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Progress, Row } from "antd";
import { inRange } from "lodash-es";
import { useSelector } from "react-redux";

import HttpService from "../../../services/httpService";
import Questionnaire from "./questionnaire";
import Utils from "../../../utils";

const redAmberGreen = (str: number) => {
  if (str >= 0 && str <= 39) {
    return "red";
  } else if (str >= 40 && str <= 69) {
    return "#ffa726";
  } else if (str >= 70) {
    return "#43a047";
  }
};

const Wrapper = styled.div`
  //border: 1px solid black;
  max-height: 68vh;
  overflow: auto;
  width: 100%;
  h3 a {
    color: #000;
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

const TitleCard = styled(Card)`
  //width: 30%;
  //margin-left: 35%;
  //margin-right: 35%;
  border: 0px;
  .ant-card-body {
    padding: 0px;
  }
  .ant-avatar {
    width: 4rem;
    height: 4rem;
  }
  .ant-card-meta-detail {
    overflow: hidden;
    margin-top: 0.5rem;
  }
`;

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
    color: ${props => redAmberGreen(props.progressColor)};
    font-size: 1em;
    line-height: 1;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    word-break: normal;
  }
`;

const { xs } = Utils.MediaQuery;

const PerformanceManagementMyView = (props: any) => {
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [prData, setPrData] = useState<any>(undefined);
  const [prSettings, setPrSettings] = useState<any>(undefined);
  const [appCycle, setAppCycles] = useState<any>([]);
  const [CurrentTimeline, setCurrentTimeline] = useState<any>("");
  const [selectedCycle, setSelectedCycle] = useState<any>(undefined);
  const [reviewCycle, setReviewCycle] = useState<any>(undefined);
  const [myPrData, setMyPrData] = useState<any>(undefined);
  const [perfTextCurrYear, setPerfTextCurrYear] = useState<any>("");
  const [perfTextPreYear, setPerfTextPreYear] = useState<any>("");
  const [questionStatus, setQuestonStatus] = useState<any>(false);
  const [questionDrawerVisible, setQuestionDrawerVisible] = useState<boolean>(
    false,
  );

  useEffect(() => {
    if (state && state.app_settings && state.app_settings.settings.cycles) {
      setAppCycles(state.app_settings.settings.cycles);
    }
    setPrSettings(state?.prSettings ?? undefined);
    setCurrentTimeline(filter.performance_cycle);
    setPrData({
      pic: state?.user?.profile_photo ? state.user.profile_photo : "",
      AvatarName: state?.user?.display_name?.charAt(0),
      Settings: state?.product_settings?.settings ?? undefined,
      OverAllRating: state?.prSettings?.overall_rating ?? undefined,
      PRSettings: state?.prSettings ?? undefined,
    });
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

  const getData = () => {
    reviewCycle &&
      HttpService.get(
        "performance/my-view",
        {},
        {
          review_cycle: reviewCycle,
        },
      )
        .then(res => {
          setMyPrData(res ?? undefined);
          //console.log(`res: ${JSON.stringify(res)}`)
        })
        .catch(err => {});
  };

  useEffect(() => {
    getData();
  }, [reviewCycle]);

  useEffect(() => {
    if (prData?.OverAllRating?.length) {
      let TempTextCurrYear: string = "N/A";
      let TempTextPreYear: string = "N/A";
      const PrOverallCurrYear: any =
        myPrData?.performance?.overallPerformanceOfCurrentPeriod ?? 0;
      const PrOverallPreYear: any =
        myPrData?.performance?.overallPerformanceOfPreviousPeriod ?? 0;
      prData?.OverAllRating.forEach((item: any, index: number) => {
        if (
          inRange(
            PrOverallCurrYear,
            prData?.OverAllRating[index]?.percentage_from,
            prData?.OverAllRating[index + 1]?.percentage_from,
          )
        ) {
          TempTextCurrYear = item?.rating_name;
          console.log(`TempTextCurr: ${TempTextCurrYear}`);
        }
        if (
          inRange(
            PrOverallPreYear,
            prData?.OverAllRating[index]?.percentage_from,
            prData?.OverAllRating[index + 1]?.percentage_from,
          )
        ) {
          TempTextPreYear = item?.rating_name;
          console.log(`TempTextPrev: ${TempTextPreYear}`);
        }
      });
      setPerfTextCurrYear(TempTextCurrYear);
      setPerfTextPreYear(TempTextPreYear);
    }
  }, [myPrData, prData?.OverAllRating]);

  useEffect(() => {
    if (myPrData?.answers?.length) {
      if (myPrData?.answers[0]["status"] === "submitted") {
        setQuestonStatus(true);
      } else {
        setQuestonStatus(false);
      }
    }
  }, [myPrData]);

  return (
    <>
      <Wrapper>
        {!questionDrawerVisible && (
          <>
            <Row justify={"space-around"} style={{ margin: "20px auto" }}>
              <Col span={6}>
                <TitleCard>
                  <Meta
                    avatar={
                      <>
                        {prData?.pic && <Avatar src={prData?.pic} />}
                        {!prData?.pic && <Avatar>{prData?.AvatarName}</Avatar>}
                      </>
                    }
                    title={state?.user?.display_name}
                    description={state?.user?.designation_name ?? "N/A"}
                  />
                </TitleCard>
              </Col>
              <Col span={5}>
                <Row style={{ margin: "auto 0px" }}>
                  <Col span={24}>
                    <span style={{ fontSize: "17px" }}>Previous Year</span>
                  </Col>
                  <Col span={24}>
                    <ProgressCss
                      progressColor={
                        myPrData?.performance
                          ?.overallPerformanceOfPreviousPeriod ?? 0
                      }
                    >
                      <Progress
                        format={percent => `${percent} %`}
                        percent={Math.round(
                          myPrData?.performance
                            ?.overallPerformanceOfPreviousPeriod ?? 0,
                        )}
                        type="line"
                        strokeColor={redAmberGreen(
                          myPrData?.performance
                            ?.overallPerformanceOfPreviousPeriod ?? 0,
                        )}
                      />
                    </ProgressCss>
                  </Col>
                  {prData?.PRSettings?.allow_employees_view_rating_managers && (
                    <Col span={24}>
                      <span style={{ fontSize: "17px" }}>
                        {perfTextPreYear}
                      </span>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col span={5}>
                <Row style={{ margin: "auto 0px" }}>
                  <Col span={24}>
                    <span style={{ fontSize: "17px" }}>Current Year</span>
                  </Col>
                  <Col span={24}>
                    <ProgressCss
                      progressColor={
                        myPrData?.performance
                          ?.overallPerformanceOfCurrentPeriod ?? 0
                      }
                    >
                      <Progress
                        format={percent => `${percent} %`}
                        percent={Math.round(
                          myPrData?.performance
                            ?.overallPerformanceOfCurrentPeriod ?? 0,
                        )}
                        type="line"
                        strokeColor={redAmberGreen(
                          myPrData?.performance
                            ?.overallPerformanceOfCurrentPeriod ?? 0,
                        )}
                      />
                    </ProgressCss>
                  </Col>
                  {prData?.PRSettings?.allow_employees_view_rating_managers && (
                    <Col span={24}>
                      <span style={{ fontSize: "17px" }}>
                        {perfTextCurrYear}
                      </span>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col span={5} style={{ textAlign: "center" }}>
                <Row style={{ margin: "auto 0px" }}>
                  <Col span={24}>
                    <span style={{ fontSize: "17px" }}>Questionnaire</span>
                  </Col>
                  <Col span={24}>
                    <Button
                      style={{
                        width: "80%",
                        backgroundColor: questionStatus ? "#55AE59" : "#FD9912",
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        setQuestionDrawerVisible(!questionDrawerVisible);
                      }}
                    >
                      {questionStatus ? "Completed" : "Yet to Submit"}
                    </Button>
                  </Col>
                  <Col span={24}>&nbsp;</Col>
                </Row>
              </Col>
              <Col span={2}></Col>
            </Row>
            <Row></Row>
            <Row justify={"space-around"} style={{ margin: "20px auto" }}>
              <Col span={3} style={{ margin: "10px auto" }}>
                <span style={{ fontSize: "17px" }}>Performance</span>
              </Col>
              <Col
                span={21}
                style={{ border: "1px solid #d3d3d3", borderRadius: "5px" }}
              >
                <Row justify={"space-around"}>
                  <Col span={17}>
                    <Row justify={"space-around"}>
                      {myPrData?.performance?.cycles &&
                        myPrData?.performance?.cycles.map(
                          (item: any, index: number) => {
                            return (
                              <Col
                                span={6}
                                key={index}
                                style={{ textAlign: "center" }}
                              >
                                {item?.name ?? ""}
                              </Col>
                            );
                          },
                        )}
                    </Row>
                  </Col>
                  <Col span={5} style={{ textAlign: "center" }}>
                    Overall
                  </Col>
                  <Col span={2}></Col>
                </Row>
                <Row justify={"space-around"}>
                  <Col span={17}>
                    <Row justify={"space-around"}>
                      {myPrData?.performance?.cycles &&
                        myPrData?.performance?.cycles.map(
                          (item: any, index: number) => {
                            return (
                              <Col
                                span={6}
                                key={index}
                                style={{ textAlign: "center" }}
                              >
                                <Progress
                                  type="circle"
                                  width={50}
                                  format={percent =>
                                    `${percent ? percent + "%" : "N/A"}`
                                  }
                                  strokeColor={redAmberGreen(
                                    item?.progress ?? 0,
                                  )}
                                  percent={
                                    item?.count
                                      ? Math.round(item?.progress ?? 0)
                                      : undefined
                                  }
                                />
                              </Col>
                            );
                          },
                        )}
                    </Row>
                  </Col>
                  <Col span={5} style={{ textAlign: "center" }}>
                    <ProgressCss
                      progressColor={
                        myPrData?.performance
                          ?.overallPerformanceOfCurrentPeriod ?? 0
                      }
                    >
                      <Progress
                        format={percent => `${percent}%`}
                        percent={Math.round(
                          myPrData?.performance
                            ?.overallPerformanceOfCurrentPeriod ?? 0,
                        )}
                        type="line"
                        strokeColor={redAmberGreen(
                          myPrData?.performance
                            ?.overallPerformanceOfCurrentPeriod ?? 0,
                        )}
                      />
                    </ProgressCss>
                  </Col>
                  <Col span={2}></Col>
                </Row>
              </Col>
            </Row>
            {prData?.Settings?.Competence && (
              <Row justify={"space-around"} style={{ margin: "20px auto" }}>
                <Col span={3} style={{ margin: "10px auto" }}>
                  <span style={{ fontSize: "17px" }}>Competence</span>
                </Col>
                <Col
                  span={21}
                  style={{ border: "1px solid #d3d3d3", borderRadius: "5px" }}
                >
                  <Row justify={"space-around"}>
                    <Col span={17}>
                      <Row justify={"space-around"}></Row>
                    </Col>
                    <Col span={5} style={{ textAlign: "center" }}>
                      Overall
                    </Col>
                    <Col span={2}></Col>
                  </Row>
                  <Row justify={"space-around"}>
                    <Col span={17}>
                      <Row justify={"space-around"}></Row>
                    </Col>
                    <Col span={5} style={{ textAlign: "center" }}>
                      <ProgressCss progressColor={50}>
                        <Progress
                          format={percent => `${percent}%`}
                          percent={Math.round(50)}
                          type="line"
                          strokeColor={redAmberGreen(50)}
                        />
                      </ProgressCss>
                    </Col>
                    <Col span={2}></Col>
                  </Row>
                </Col>
              </Row>
            )}
          </>
        )}
        {questionDrawerVisible && (
          <Questionnaire
            setQuestionDrawerVisible={setQuestionDrawerVisible}
            getData={getData}
          />
        )}
      </Wrapper>
    </>
  );
};

export default PerformanceManagementMyView;
