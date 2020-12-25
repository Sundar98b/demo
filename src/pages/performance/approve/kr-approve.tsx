import moment from "moment";
import styled from "styled-components";
import React, { memo, useEffect, useState } from "react";
import { Button, Col, Collapse, Progress, Row, Tag, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { uniqBy } from "lodash-es";
import { useSelector } from "react-redux";

import EmptyImg from "../../../components/empty";
import HttpService from "../../../services/httpService";
import ObjectiveTypeAvatar from "../../../components/org-type";
import Rolecheck from "../../../components/role-check";
import SKLoader from "../../../components/skloader";
import Status from "../../../components/status";
import Utils from "../../../utils";

const { xs } = Utils.MediaQuery;
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
  height: 70vh;
  overflow: auto;
  width: 98%;
  h3 a {
    color: #000;
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

const KRAprove: React.FC = () => {
  const [CurrentCycle, setCurrentCycle] = useState();
  const [CurrentTimeline, setCurrentTimeline] = useState("");
  const [apiEndPoint, setApiEndPoint] = useState("");
  const [Loading, setLoading] = useState(true);
  const [isExpand, setisExpand] = useState(false);
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState<any | undefined>(undefined);

  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);

  useEffect(() => {
    setisExpand(!!state?.isExpand);
  }, [state]);

  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    setCurrentTimeline(filter.performance_cycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentTimeline, state]);

  useEffect(() => {
    if (CurrentCycle || CurrentTimeline) {
      setApiEndPoint(`key-results/approval/${CurrentTimeline ?? CurrentCycle}`);
    }
  }, [CurrentTimeline, CurrentCycle]);

  useEffect(() => {
    if (apiEndPoint) {
      HttpService.get(apiEndPoint)
        .then(res => {
          const resultSet: any[] = res;
          setData(res);
          const newSet: any[] = uniqBy(resultSet, "user_id");
          setGroupedData(newSet);
          setLoading(false);
        })
        .catch((err: any) => {
          console.warn(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndPoint]);

  const listView = (listItem: any) => {
    return (
      <div>
        {!Loading && (
          <Scroller>
            <div key={listItem.id}>
              <Obj>
                <Row justify="space-around" align="middle">
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
                            <H4>{listItem.description}</H4>
                            <H5>
                              {moment(listItem.start_date).format("DD-MMM") +
                                " to " +
                                moment(listItem.end_date).format("DD-MMM")}
                            </H5>
                          </div>
                        )}
                        {!isExpand && (
                          <Tooltip title={listItem.description}>
                            <div>
                              <H4 className="truncate">
                                {listItem.description}
                              </H4>
                              <H5 className="truncate">
                                {moment(listItem.start_date).format("DD-MMM") +
                                  " to " +
                                  moment(listItem.end_date).format("DD-MMM")}
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
                          <div>{listItem.objective_description}</div>
                        )}
                        {!isExpand && (
                          <Tooltip title={listItem.objective_description}>
                            <div className="truncate">
                              {listItem.objective_description}
                            </div>
                          </Tooltip>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={3} style={{ textAlign: "right" }}>
                    <ProgressCss progressColor={listItem.progress}>
                      <Progress
                        percent={Math.round(listItem.progress)}
                        type="line"
                        strokeColor={redAmberGreen(listItem.progress)}
                      />
                    </ProgressCss>
                  </Col>
                  <Col span={2}>
                    <Status name={listItem.checkin_status} />
                  </Col>
                  <Col>
                    <Button type="primary" size="small">
                      <Link to={`/performance/checkin/m/${listItem.kr_id}`}>
                        Approve
                      </Link>
                    </Button>
                  </Col>
                </Row>
              </Obj>
            </div>
          </Scroller>
        )}
      </div>
    );
  };

  return (
    <Rolecheck module="Key Results" action="checkin" fullpage>
      <Wrapper>
        {Loading && <SKLoader />}
        {!Loading && !data.length && (
          <EmptyImg description={<>No Approvals available</>}></EmptyImg>
        )}
        {!Loading && data.length && (
          <div>
            {groupedData.map((item1: any) => {
              return (
                <div>
                  <Row style={{ margin: "10px 0" }}>
                    <Col span={1}>
                      <ObjectiveTypeAvatar
                        type={"user"}
                        name={item1.user_name}
                        image={item1.user_pic}
                      />
                    </Col>
                    <Col span={20}>
                      {" "}
                      <h3>{item1.user_name}</h3>
                    </Col>
                  </Row>
                  {data?.map((item: any, index: number) => {
                    if (item.user_name === item1.user_name) {
                      return listView(item);
                    }
                  })}
                </div>
              );
            })}
          </div>
        )}
      </Wrapper>
    </Rolecheck>
  );
};

export default memo(KRAprove);
