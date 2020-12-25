import moment from "moment";
import styled from "styled-components";
import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Col,
  Collapse,
  Progress,
  Row,
  Tag,
  Tooltip,
  message,
} from "antd";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import EmptyImg from "../../../components/empty";
import HttpService from "../../../services/httpService";
import MyOkrList from "../my-okr/my-okr-list";
import ObjectiveTypeAvatar from "../../../components/org-type";
import Rolecheck from "../../../components/role-check";
import SKLoader from "../../../components/skloader";
import Status from "../../../components/status";
import Utils from "../../../utils";

const { xs } = Utils.MediaQuery;
const { Panel } = Collapse;
const redAmberGreen = (str: number) => {
  if (str >= 0 && str <= 39) {
    return "red";
  } else if (str >= 40 && str <= 69) {
    return "#ffa726";
  } else if (str >= 70) {
    return "#43a047";
  }
};

const TopDiv = styled.div`
  border: 1px solid #850746;
  margin: 0 4px 2px 4px;
  padding: 2px;
  border-radius: 8px;
  .ant-row {
    //border: 1px solid green;
  }
  .ant-col {
    //border: 1px solid red;
  }
`;

const TopButton = styled(Button)`
  color: #ffffff;
  background: #850746;
  width: 100%;
  :hover {
    color: #ffffff;
    background: #850746;
    font-style: italic;
  }
  :active {
    color: #ffffff;
    background: #850746;
  }
  :focus {
    color: #ffffff;
    background: #850746;
  }
`;

const Wrapper = styled.div`
  //border: 1px solid black;
  max-height: 68vh;
  overflow: auto;
  width: 100%;
  h3 a {
    color: #000;
  }
  .ant-progress-bg {
    height: 8px !important;
  }
`;

const ProgressCss = styled.div`
  .ant-progress-bg {
    height: 25px !important;
  }
  .ant-progress-text {
    display: inline-block;
    width: 2em;
    margin-left: 8px;
    color: ${props => redAmberGreen(props.progressColor)};
    font-size: 1em;
    line-height: 1;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    word-break: normal;
  }
`;

const Obj = styled.div`
  background: #fff;
  margin: 3px;
  /* box-shadow: 2px 0.8rem 1rem rgba(0, 0, 0, 0.05); */
  border-radius: 16px;
  //padding: 5px 12px;
  border: 1px solid #1864ab;
  line-height: 23px;
  ::before {
    content: " ";
    display: "table";
    clear: both;
  }
  .ant-radio-group {
    float: right;
  }
  .ant-dropdown-link {
    color: #000;
  }
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ${xs} {
    > .ant-row {
      display: block;
      > .ant-col {
        max-width: 100% !important;
        width: 100% !important;
        margin-bottom: 6px;
        > h3 {
          margin-bottom: 0px;
        }
        &.ant-col-1.text-red,
        &.ant-col-1.text-red + .ant-col {
          text-align: left !important;
        }
      }
    }
  }
`;

const TagCss = styled.div`
  .ant-tag {
    font-size: 10px;
    border: none;
  }
`;

const H4 = styled.h4`
  margin-bottom: 0em;
  margin-left: 1em;
`;
const H5 = styled.h5`
  margin-bottom: 0em;
  margin-left: 1em;
`;

const Scroller = styled.div``;

const CheckIn: React.FC = () => {
  const history = useHistory();
  const [CurrentCycle, setCurrentCycle] = useState();
  const [apiEndPoint, setApiEndPoint] = useState("");
  const [Loading, setLoading] = useState(true);
  const [CurrentTimeline, setCurrentTimeline] = useState("");
  const [currentData, setCurrentData] = useState<any>([]);
  const [overdueData, setOverdueData] = useState<any>([]);
  const [upcomingData, setUpcomingData] = useState<any>([]);
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [isExpand, setisExpand] = useState(false);
  const [activeKeyValue, setActiveKeyValue] = useState<string | undefined>(
    undefined,
  );
  const [isOkrButton, setIsOkrButton] = useState(false);
  const [overallPerformance, setOverallPerformance] = useState<any>(0);

  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    setCurrentTimeline(filter.performance_cycle);
    setisExpand(state.isExpand);
  }, [CurrentTimeline, state]);
  useEffect(() => {
    if (CurrentCycle || CurrentTimeline) {
      setApiEndPoint(`key-results/user/${CurrentTimeline ?? CurrentCycle}`);
      HttpService.get(
        "insights/my-performance",
        {},
        { performance_cycle: CurrentTimeline },
      ).then(res => {
        if (res?.performance) {
          setOverallPerformance(res?.performance);
        } else {
          setOverallPerformance(0);
        }
      });
    }
  }, [CurrentTimeline, CurrentCycle]);
  useEffect(() => {
    if (apiEndPoint) {
      message.loading("Loading...");
      HttpService.get(apiEndPoint, "", { timeline: "overdue" })
        .then(res => {
          setOverdueData(res);
          setLoading(false);
          if (res?.length) {
            setActiveKeyValue("1");
          } else {
            setActiveKeyValue("2");
          }
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {
          message.destroy();
        });
      HttpService.get(apiEndPoint, "", { timeline: "current" })
        .then(res => {
          setCurrentData(res);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {
          message.destroy();
        });
      HttpService.get(apiEndPoint, "", { timeline: "upcoming" })
        .then(res => {
          setUpcomingData(res);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {
          message.destroy();
        });
    }
  }, [CurrentCycle, apiEndPoint]);

  useEffect(() => {
    if (isOkrButton) {
      history.push("/performance/my-okrs");
    }
  }, [isOkrButton]);

  const ActiveKey = (key: any) => {
    setActiveKeyValue(key);
  };

  const listView = (listItem: any) => {
    return (
      <div>
        {!Loading && !listItem?.length && (
          <EmptyImg description={<>No OKR available</>}></EmptyImg>
        )}
        {!Loading && (
          <>
            {listItem &&
              listItem?.map((item: any, index: number) => (
                <div key={item.id}>
                  <Obj>
                    <Row justify="space-around" align="middle">
                      <Col span={1}>
                        <ObjectiveTypeAvatar
                          type={"user"}
                          name={item.user_name}
                          image={item.user_pic}
                        />
                      </Col>
                      <Col span={7}>
                        <Row>
                          <Col span={3}>
                            <TagCss>
                              <Tag color="purple" style={{ marginTop: "1em" }}>
                                KR
                              </Tag>
                            </TagCss>
                          </Col>
                          <Col span={21}>
                            {isExpand && (
                              <div>
                                <H4>{item.kr_description}</H4>
                                <H5>
                                  {moment(item.start_date).format("DD-MMM") +
                                    " to " +
                                    moment(item.end_date).format("DD-MMM")}
                                </H5>
                              </div>
                            )}
                            {!isExpand && (
                              <Tooltip title={item.description}>
                                <div>
                                  <H4 className="truncate">
                                    {item.kr_description}
                                  </H4>
                                  <H5 className="truncate">
                                    {moment(item.start_date).format("DD-MMM") +
                                      " to " +
                                      moment(item.end_date).format("DD-MMM")}
                                  </H5>
                                </div>
                              </Tooltip>
                            )}
                          </Col>
                        </Row>
                      </Col>
                      <Col span={5}>
                        <Row>
                          <Col span={4}>
                            <TagCss>
                              <Tag color="purple">Obj</Tag>
                            </TagCss>
                          </Col>
                          <Col span={20}>
                            {isExpand && (
                              <div>{item.objective_description}</div>
                            )}
                            {!isExpand && (
                              <Tooltip title={item.objective_description}>
                                <div className="truncate">
                                  {item.objective_description}
                                </div>
                              </Tooltip>
                            )}
                          </Col>
                        </Row>
                      </Col>
                      <Col span={3} style={{ textAlign: "right" }}>
                        <ProgressCss progressColor={item.progress}>
                          <Progress
                            percent={Math.round(item.progress)}
                            type="line"
                            strokeColor={redAmberGreen(item.progress)}
                          />
                        </ProgressCss>
                      </Col>
                      <Col span={2}>
                        <Status name={item.checkin_status} />
                      </Col>
                      <Col>
                        <Button type="primary" size="small">
                          <Link to={`/performance/checkin/e/${item.kr_id}`}>
                            CheckIn
                          </Link>
                        </Button>
                      </Col>
                    </Row>
                  </Obj>
                </div>
              ))}
          </>
        )}
      </div>
    );
  };

  const CheckinToggle = () => {
    setIsOkrButton(true);
  };

  return (
    <Rolecheck module="Key Results" action="checkin" fullpage>
      {!isOkrButton && (
        <Wrapper>
          <TopDiv>
            <Row>
              <Col span={2} style={{ textAlign: "center", paddingTop: "5px" }}>
                <strong>{CurrentTimeline}</strong>
              </Col>
              <Col span={20} style={{ paddingTop: "5px" }}>
                Overall Performance &nbsp;
                <strong>{Utils.round((overallPerformance ?? 0) + "")}%</strong>
              </Col>
              <Col span={2}>
                <TopButton onClick={CheckinToggle}>OKR</TopButton>
              </Col>
            </Row>
          </TopDiv>
          {Loading && <SKLoader />}
          <Collapse
            style={{ width: "100%" }}
            bordered={false}
            onChange={ActiveKey}
            defaultActiveKey={overdueData?.length ? ["1"] : ["2"]}
            activeKey={activeKeyValue}
          >
            <Panel
              header={
                <Col
                  span={4}
                  style={{ textAlign: "left", width: "100%" }}
                  className={"text-" + Utils.redAmberGreen(10)}
                >
                  <b>Overdue</b> &nbsp; ({overdueData?.length ?? 0})
                </Col>
              }
              key="1"
            >
              <p>{listView(overdueData)}</p>
            </Panel>
            <Panel
              header={
                <Col
                  span={4}
                  style={{ textAlign: "left" }}
                  className={"text-" + Utils.redAmberGreen(50)}
                >
                  <b>Current</b> &nbsp; ({currentData?.length ?? 0})
                </Col>
              }
              key="2"
            >
              <p>{listView(currentData)}</p>
            </Panel>
            <Panel
              header={
                <Col
                  span={4}
                  style={{ textAlign: "left" }}
                  className={"text-" + Utils.redAmberGreen(90)}
                >
                  <b>Upcoming</b> &nbsp; ({upcomingData?.length ?? 0})
                </Col>
              }
              key="3"
            >
              <p>{listView(upcomingData)}</p>
            </Panel>
          </Collapse>
        </Wrapper>
      )}
      {isOkrButton && (
        <MyOkrList
          embed={true}
          cycle={CurrentTimeline}
          isMyTeam={true}
          //teamSwitch={CurrentTab}
          //new={DrawerVisisble}
        />
      )}
    </Rolecheck>
  );
};

export default CheckIn;
