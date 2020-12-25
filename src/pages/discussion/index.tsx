import Fuse from "fuse.js";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Alert, Badge, Col, Input, List, Row, message } from "antd";
import { truncate, uniqBy } from "lodash-es";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import IsManager from "../../components/is-manager";
import MessageComponent from "../../components/messages";
import ObjectiveTypeAvatar from "../../components/org-type";
import Rolecheck from "../../components/role-check";
import RootPage from "../root";
import ToggleButton from "../../components/toggle";
import messageart from "../../assets/message.svg";

const MessageWrapper = styled.div`
  border-left: 1px solid #dedede;
  height: 80vh;
  #messages-scroll {
    height: 83vh;
  }
  .msg-art {
    img {
      height: 80vh;
      width: auto;
      opacity: 0.5;
    }
    .ant-alert {
      width: 60%;
      margin: 0 auto;
    }
  }
`;

const LeftPanel = styled.div`
  padding: 3px;
  .ant-input-search {
    border-radius: 16px;
    margin-top: 12px;
    margin-bottom: 3px;
  }
  .ant-list-item {
    padding-bottom: 5px;
    cursor: pointer;
    padding-left: 3px;
    border-left: 2px solid transparent;

    &.active {
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(249, 241, 252, 0.25);
      border-left: 2px solid #9c27b0;
    }
    p {
      margin-bottom: 0;
    }
  }
`;
const ListData = styled.div`
  height: 70vh;
  overflow-y: auto;
`;

const { Search } = Input;

const SearchOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 3,
  keys: ["user_name", "description"],
  include: ["score", "matches"],
  verbose: true,
};

const Discussion: React.FC = () => {
  const [ActiveTabs, setActiveTabs] = useState("my-kr");
  const [ActiveKR, setActiveKR] = useState("");
  const [listOfKr, setlistOfKr] = useState([]);
  const [PerFormanceCycle, setPerFormanceCycle] = useState("");
  const [visitedIDS, setvisitedIDS]: [any, Function] = useState([]);
  const [ActualKRLists, setActualKRLists] = useState([]);
  const filters = useSelector((store: any) => store.FILTERS);
  const [groupedData, setGroupedData] = useState<any | undefined>(undefined);

  useEffect(() => {
    setPerFormanceCycle(filters.performance_cycle);
  }, [filters.performance_cycle]);

  useEffect(() => {
    let url = "";
    if (ActiveTabs === "my-kr") {
      url = "key-results/my-kr";
    } else {
      url = "key-results/my-team";
    }
    if (PerFormanceCycle) {
      message.loading("Loading...");
      HttpService.get(
        url,
        {},
        {
          performance_cycle: PerFormanceCycle,
        },
      ).then(res => {
        setlistOfKr(res);
        setActualKRLists(res);
        const newSet: any[] = uniqBy(res, "user_id");
        setGroupedData(newSet);
        message.destroy();
      });
    }
  }, [ActiveTabs, PerFormanceCycle]);

  const openMessage = (id: string) => {
    setActiveKR(id);
    const newIDs = [...visitedIDS];
    newIDs.push(id);
    setvisitedIDS(newIDs);
  };

  const OnSearch = (q: string) => {
    const fuse = new Fuse(ActualKRLists, SearchOptions); // "list" is the item array

    const result: any = fuse.search(q);

    const finalResult: any = [];
    if (result.length) {
      result.forEach((item: any) => {
        finalResult.push(item.item);
      });
      setlistOfKr(finalResult);
    } else {
      setlistOfKr([]);
    }
    if (!q.length) {
      setlistOfKr(ActualKRLists);
    }
  };

  return (
    <RootPage sidebar="discussion">
      <Rolecheck module="Discussions" fullpage>
        <Row>
          <Col span={6}>
            <LeftPanel>
              <IsManager>
                <div className="text-center">
                  <ToggleButton
                    uncheckedText="My KR"
                    checkedText="My Team"
                    onChange={(tab: string) => {
                      setActiveTabs(tab === "My KR" ? "my-kr" : "my-team-kr");
                    }}
                  />
                </div>
              </IsManager>
              <Search
                placeholder="Search the KR"
                style={{ width: "100%", borderRadius: "20px" }}
                onSearch={e => OnSearch(e)}
                onChange={e => OnSearch(e.currentTarget.value)}
              />
              {listOfKr?.length && (
                <div>
                  {groupedData?.map((item1: any) => {
                    let newSet: any[] = [];

                    listOfKr?.map((item: any, index: number) => {
                      if (item.user_name === item1.user_name) {
                        return newSet.push(item);
                      }
                    });

                    return (
                      <div>
                        <Row style={{ margin: "10px 0" }}>
                          <Col span={4}>
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
                        <ListData>
                          <List
                            itemLayout="horizontal"
                            dataSource={newSet}
                            renderItem={(item: any) => (
                              <List.Item
                                className={ActiveKR === item.id ? "active" : ""}
                                onClick={() => openMessage(item.id)}
                              >
                                <List.Item.Meta
                                  title={
                                    <Badge
                                      count={
                                        visitedIDS.indexOf(item.id) === -1
                                          ? parseInt(item.unread, 10)
                                          : 0
                                      }
                                    >
                                      {truncate(item.description, {
                                        length: 35,
                                      })}
                                    </Badge>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </ListData>
                      </div>
                    );
                  })}
                </div>
              )}
            </LeftPanel>
          </Col>
          <Col span={17}>
            <MessageWrapper kr={ActiveKR}>
              {!ActiveKR && (
                <div className="msg-art">
                  <Alert
                    type="warning"
                    showIcon
                    message={"Select KR to View Message"}
                    closable
                  />
                  <img src={messageart} alt="Message Placeholder" />
                </div>
              )}
              {ActiveKR && <MessageComponent kr_id={ActiveKR} />}
            </MessageWrapper>
          </Col>
        </Row>
      </Rolecheck>
    </RootPage>
  );
};

export default Discussion;
