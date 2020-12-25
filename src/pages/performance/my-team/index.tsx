import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Col, Collapse, Row } from "antd";
import { useSelector } from "react-redux";

import Approve from "../approve";
import HttpService from "../../../services/httpService";
import LazyImage from "../../../components/lazy-img";
import MyOkrList from "../my-okr/my-okr-list";
import ObjWeightage from "../approve/weightage";
import SKLoader from "../../../components/skloader";
import Utils from "../../../utils";
import { AvatarImg } from "../../../components/user-chip";
import { HasPermission } from "../../../components/topbar/menu";

const { Panel } = Collapse;

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
  //width: 100%;
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
`;
const Name = styled.strong`
  cursor: pointer;
`;

const PannelHeadingWrapper = styled.div`
  .ant-row {
    //border: 1px solid black;
  }
  .ant-col {
    //border: 1px solid red;
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
`;
const Padder = styled.div`
  padding-left: 26px;
  padding-top: 20px;
`;
interface UserCard {
  name: string;
  img: string;
  count: number;
  progress: number;
  hide?: boolean;
  department: string;
  id: string;
  onOpen?: Function;
  hasChild: boolean;
  openModal: Function;
}

const findNode = (needle: string, heystack: any, prefix = ""): any => {
  var output;

  for (const key in heystack) {
    if (key === needle) {
      return (output = prefix + key);
    }
    //@ts-ignore
    if (heystack[key]["children"]) {
      output = findNode(
        needle,
        heystack[key]["children"],
        prefix + key + `.children.`,
      );
    }
  }
  return output;
};

const MyTeam: React.FC = () => {
  const [isLoaded, setisLoaded] = useState(false);
  const [Team, setTeam] = useState({});
  const [CurrentCycle, setCurrentCycle] = useState();
  const [CurrentTimeline, setCurrentTimeline] = useState("");
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  //const [isExpand, setisExpand] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [Users, setUsers] = useState({
    name: "",
    pic: "",
    id: "",
  });
  const [openApprovalPage, setOpenApprovalPage] = useState(false);
  const [approvalActivePage, setApprovalActivePage] = useState("");
  const [openObjWeightageModal, setOpenObjWeightageModal] = useState(false);
  const [objWeightageUserId, setObjWeightageUserId] = useState();
  const [teamPerformance, setTeamPerformance] = useState<number>(0);

  const EnabledModule = state?.product_settings?.settings;
  const roles = state?.roles?.role;
  const _HasPermission = (key: any) => {
    return HasPermission(key, roles, EnabledModule, state);
  };

  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    setCurrentTimeline(filter.performance_cycle);
    //setisExpand(state.isExpand);
  }, [CurrentTimeline, state]);

  useEffect(() => {
    if (state?.user?.id && CurrentTimeline) {
      getTeam(state?.user?.id, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.user, CurrentTimeline]);

  const getTeam = (id: string, isDrill = true) => {
    let newData;
    HttpService.get(
      "objectives/my-team/" + id,
      {},
      {
        performance_cycle: CurrentTimeline,
      },
    )
      .then(response => {
        if (response.length > 0) {
          //console.log(`response: ${JSON.stringify(response)}`);
          let tempTotalTeamPerformance = teamPerformance;
          let tempTeamPerformance = 0;
          response.forEach((item: any) => {
            tempTotalTeamPerformance += item.progress ?? 0;
          });
          tempTeamPerformance = tempTotalTeamPerformance / response.length;
          setTeamPerformance(parseFloat(tempTeamPerformance.toFixed(2)));
        }
        if (!isDrill) {
          newData = { ...Team };
          response.map((team: any) => {
            newData[team.id] = team;
            return team;
          });
          setTeam(newData);
        } else {
          const newTeam: any = {};
          response.map((team: any) => {
            newTeam[team.id] = team;
            return team;
          });
          const nodeId = findNode(id, Team);
          let ModifiedTeam: any = { ...Team };

          let newModified = propertyAccessor(ModifiedTeam, nodeId);
          newModified.children = newTeam;

          setTeam(ModifiedTeam);
        }
      })
      .finally(() => {
        setisLoaded(true);
      });
  };

  const propertyAccessor = (object: any, keys: string, array?: any): any => {
    array = array || keys.split(".");

    if (array.length > 1) {
      // @ts-ignore
      return propertyAccessor(object[array.shift()], null, array);
    } else {
      return object[array];
    }
  };

  const ApproveButtonToggle = (value: string) => {
    setOpenApprovalPage(true);
    setApprovalActivePage(value);
  };

  const TeamListPanel = (props: any) => {
    const { item }: any = props;
    const { team }: any = props;
    // const tempProgress = team[item].progress ?? 0;
    // let tempTeamPerformance = teamPerformance;
    // tempTeamPerformance += tempProgress;
    //setTeamPerformance
    return (
      <PannelHeadingWrapper>
        <Row>
          <Col span={1} style={{ textAlign: "center", paddingTop: "6px" }}>
            {console.log(`item: ${JSON.stringify(team[item])}`)}
            {item.profile_photo && (
              <LazyImage src={team[item].profile_photo} alt="Profile Pic" />
            )}
            {!item.profile_photo && (
              <AvatarImg>{team[item].display_name.charAt(0)}</AvatarImg>
            )}
          </Col>
          <Col span={4}>
            <Row>
              <strong>{team[item].display_name}</strong>
            </Row>
            <Row>{team[item].department_name || "No Department Specified"}</Row>
          </Col>
          <Col span={4}>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                Overall Performance
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                <strong>{Utils.round((team[item].progress ?? 0) + "")}%</strong>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                Overdue KRs
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                <strong>{Utils.round((team[item].overdue ?? 0) + "")}</strong>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                Current KRs
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                <strong>{Utils.round((team[item].current ?? 0) + "")}</strong>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                Upcoming KRs
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                <strong>{Utils.round((team[item].upcoming ?? 0) + "")}</strong>
              </Col>
            </Row>
          </Col>
          <Col span={3} style={{ paddingTop: "6px" }}>
            {state?.product_settings?.settings["Performance Management"] && (
              <TopButton
                onClick={() => {
                  setOpenObjWeightageModal(true);
                  setObjWeightageUserId(team[item].id);
                }}
              >
                {"Obj Weightage"}
              </TopButton>
            )}
          </Col>
        </Row>
      </PannelHeadingWrapper>
    );
  };

  return (
    <>
      {openObjWeightageModal && objWeightageUserId && (
        <ObjWeightage
          userId={objWeightageUserId ?? ""}
          isModalVisible={openObjWeightageModal}
          setIsModalVisible={setOpenObjWeightageModal}
        />
      )}
      {!openApprovalPage && (
        <Wrapper>
          {!isLoaded && <SKLoader />}
          {isLoaded && (
            <>
              <TopDiv>
                <Row justify={"space-around"}>
                  <Col
                    span={2}
                    style={{ textAlign: "center", paddingTop: "5px" }}
                  >
                    <strong>{CurrentTimeline}</strong>
                  </Col>
                  <Col span={12} style={{ paddingTop: "5px" }}>
                    Team Performance &nbsp;
                    <strong>{Utils.round(teamPerformance + "")}%</strong>
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <TopButton onClick={() => ApproveButtonToggle("kr")}>
                      Checkin Approve
                    </TopButton>
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <TopButton onClick={() => ApproveButtonToggle("obj-new")}>
                      New Obj Approve
                    </TopButton>
                  </Col>
                  {/* <Col style={{ textAlign: "right" }}>
                    <TopButton onClick={() => ApproveButtonToggle("obj-weightage")}>
                      Obj Weightage
                    </TopButton>
                  </Col> */}
                  <Col style={{ textAlign: "right" }}>
                    <TopButton onClick={() => ApproveButtonToggle("obj-close")}>
                      Obj Closure
                    </TopButton>
                  </Col>
                </Row>
              </TopDiv>
              <Collapse bordered={false}>
                {Object.keys(Team).map(item => (
                  <Panel
                    header={<TeamListPanel team={Team} item={item} />}
                    key={item}
                  >
                    <MyOkrList
                      embed={true}
                      id={item}
                      cycle={CurrentTimeline}
                      isMyTeam={true}
                      isMyTeamPage={true}
                    />
                  </Panel>
                ))}
              </Collapse>
            </>
          )}
        </Wrapper>
      )}
      {openApprovalPage && <Approve pageName={approvalActivePage} />}
    </>
  );
};

export default MyTeam;
