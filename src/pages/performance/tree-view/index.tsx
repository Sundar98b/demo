import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button, Checkbox, Col, Form, Progress, Row, Select } from "antd";
import { PlusCircleOutlined, TeamOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { Tree, TreeNode } from "react-organizational-chart";
import { isEmpty } from "lodash-es";
import { useSelector } from "react-redux";

import Utils from "../../../utils";
import HttpService from "../../../services/httpService";
import MiniProgress from "../../../components/miniprogress";
import Modal from "../../../components/modal";
import MyOkrList from "../my-okr/my-okr-list";
import SKLoader from "../../../components/skloader";
import { AvatarImg } from "../../../components/user-chip";

interface MyTree {
  root?: boolean;
  slider?: boolean;
}

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
const Card = styled.div`
  width: 200px;
  height: 80px;
  border-radius: 3px;
  border: var(--light-bdr);
  display: inline-block;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 12px;
  text-align: left;
  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  p > strong {
    cursor: pointer;
  }
  img {
    cursor: pointer;

    width: 25px;
    height: 25px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
  }
  .ant-progress-text {
    font-size: 8px;
  }
`;
const Warpper = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;
  margin: 0;
  height: 80vh;
  width: 90vw;
  background-color: transparent;
  padding: 12px;
`;
const BtnWrapper = styled.div`
  text-align: center;
  z-index: 0;
  padding-top: 7px;
  .ant-btn {
    background: none;
    box-shadow: none;
  }
`;
const Content = styled.div`
  margin-left: 38px;
  margin-right: 38px;
`;

const Count = styled.div`
    background: antiquewhite;
    padding: 0px;
    padding-left: 15%;
    margin-top: 10%;
    border-radius: 50%;
    height: 25px;
    width: 25px;
    float: right;
    display: block;
  .ant-badge-count,
  .ant-badge-dot,
  .ant-badge .ant-scroll-number-custom-component {
    top: -2px;
    right: -10px;
  }
`;
const CardPref = styled.div``;
interface TreeView {
  name: string;
  department: string;
  progress: number;
  count: number;
  img: string;
  hide: boolean;
  isToBeOpened: boolean;
  onOpen?: Function;
  id: string;
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

const TreeView: React.FC<TreeView> = props => {
  return (
    <Card>
      <Row>
        <Col
          span={4}
          onClick={() => props.openModal(props.id, props.name, props.img)}
        >
          {props.img ? <Avatar size="small"  src={props.img} />
          :<Avatar size="small" style={{backgroundColor: '#f56a00'}}>
            {props.name.charAt(0)}
          </Avatar>}
        </Col>
        <Col span={14} style={{fontSize:"10px"}}>
        
          <p onClick={() => props.openModal(props.id, props.name, props.img)} >
            {props.name}
          </p>
          {props.department || "No Department Specified"}
          
        </Col>
        <Col span={6} style={{display:"flex" ,flexDirection:"column" , alignItems:"center"}}>
        {!props.hide && 
          <Progress
              format={() => `${props.progress ?? 0}%`}
              type="circle"
              width={30}
              strokeWidth={10}
              strokeColor={Utils.redAmberGreenStroke(
                props.progress
              )}
              percent={
                props.progress
              }
          />
          }
          {!props.hide && props.count > 0 && (
            <Count>
              <Badge count={props.count} style={{fontSize:"12px"}}>
                <TeamOutlined />
              </Badge>
            </Count>
          )}
        </Col>
      </Row>
      {props.isToBeOpened && (
        <BtnWrapper>
          <Button
            onClick={() => props.onOpen && props.onOpen(props.id)}
            icon={<PlusCircleOutlined />}
          />
        </BtnWrapper>
      )}
    </Card>
  );
};

const TreeStructure = (props: any) => {
  const { items } = props;
  return (
    <>
      {Object.keys(items).map(key => (
        <TreeNode
          key={items[key].id}
          label={
            <TreeView
              openModal={(id: string, name: string, pic: string) =>
                props.openModal(
                  id,
                  items[key].display_name,
                  items[key].profile_photo,
                )
              }
              name={items[key].display_name}
              department={
                items[key].department_name || "No Department Specified"
              }
              id={key}
              hide={false}
              progress={parseInt(items[key].progress) || 0}
              count={parseInt(items[key].sub_count) || 0}
              img={items[key].profile_photo}
              isToBeOpened={
                isEmpty(items[key].children) && parseInt(items[key].sub_count)
                  ? true
                  : false
              }
              onOpen={(item: any) => {
                props.onOpen(item);
              }}
            />
          }
        >
          {items[key].children && (
            <TreeStructure
              openModal={(id: string, name: string, pic: string) =>
                props.openModal(id, name, pic)
              }
              onOpen={(item: any) => {
                props.onOpen(item);
              }}
              items={items[key].children}
            />
          )}
        </TreeNode>
      ))}
    </>
  );
};

const MyTree: React.FC<MyTree> = props => {
  const [CurrentTimeline, setCurrentTimeline] = useState<any>("");
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [Team, setTeam] = useState({});
  const [isLoaded, setisLoaded] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [Users, setUsers] = useState({
    name: "",
    pic: "",
    id: "",
  });
  
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
  console.log(Team)
  const propertyAccessor = (object: any, keys: string, array?: any): any => {
    array = array || keys.split(".");

    if (array.length > 1) {
      // @ts-ignore
      return propertyAccessor(object[array.shift()], null, array);
    } else {
      return object[array];
    }
  };
  const openModal = (id: string, name: string, pic: string) => {
    setUsers({ name: name, pic: pic, id });
    setModalVisible(true);
  };
  const openDrill = (id: string) => {
    getTeam(id, true);
  };
  useEffect(() => {
    setCurrentTimeline(filter.performance_cycle);
  }, [state]);

  return (
    <>
      <Modal
        user_name={Users.name}
        user_pic={Users.pic}
        visibility={ModalVisible}
        onClose={() => {
          setModalVisible(!ModalVisible);
        }}
      >
        <MyOkrList
          embed={true}
          id={Users.id}
          cycle={CurrentTimeline}
          isMyTeamPage={true}
        />
      </Modal>
      <Warpper>
        <TopDiv>
          <Row justify="space-between" align="middle">
            <Col span={2} style={{ textAlign: "center" }}>
              <strong>{CurrentTimeline}</strong>
            </Col>
            <Col span={2}>
              <Select
                placeholder="Location"
                filterOption={(input:any, option:any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size="small"
              >
              </Select>
            </Col>
            <Col span={2}>
              <Select
                placeholder="Department"
                filterOption={(input:any, option:any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size="small"
              >
              </Select>
            </Col>
            <Col span={2}>
              <Select
                placeholder="Goal"
                filterOption={(input:any, option:any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size="small"
              >
              </Select>
            </Col>
            <Col span={2}>
              <Select
                placeholder="Top Name"
                filterOption={(input:any, option:any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size="small"
              >
              </Select>
            </Col>
            <Col span={4}><Checkbox style={{fontSize:"smaller"}}>Show location</Checkbox></Col>
            <Col span={1}></Col>
            <Col span={2} style={{display:"flex" , justifyContent:"space-evenly"}}>
              <div><ZoomInOutlined /></div>
              <div><ZoomOutOutlined /></div>
            </Col>
          </Row>
          {/* <Form.Item label="Performance Cycle">
            <Select
              value={CurrentTimeline}
              onChange={(val: any) => setCurrentCycle(val)}
              style={{ width: "200px" }}
            >
              {state?.app_settings?.settings?.cycles?.map((item: any) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
        </TopDiv>
        {isLoaded && (
          <Content>
            <Tree
              nodePadding={"12px"}
              lineWidth={"2px"}
              lineHeight={"30px"}
              lineColor={"#d3d3d3"}
              lineBorderRadius={"10px"}
              label={
                <TreeView
                  name={state?.user?.display_name}
                  department={state?.user?.department_name}
                  img={state?.user?.profile_photo}
                  count={0}
                  progress={0}
                  hide
                  id={state?.user?.id}
                  isToBeOpened={false}
                  openModal={() => null}
                />
              }
            >
              <TreeStructure
                onOpen={(id: string) => openDrill(id)}
                items={Team}
                openModal={(id: string, name: string, pic: string) =>
                  openModal(id, name, pic)
                }
              />
            </Tree>
          </Content>
        )}
        {!isLoaded && <SKLoader />}
      </Warpper>
    </>
  );
};
MyTree.defaultProps = {
  root: true,
  slider: false,
};
export default MyTree;
