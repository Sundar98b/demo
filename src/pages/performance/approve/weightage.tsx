import _ from "lodash-es";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Input,
  Modal,
  Row,
  Tooltip,
  notification,
} from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import HttpService from "../../../services/httpService";
import ObjectiveTypeAvatar from "../../../components/org-type";
import { HasPermission } from "../../../components/topbar/menu";

const Wrapper = styled.div`
  height: 66vh;
  overflow: auto;
  .ant-avatar {
    height: 1.5rem;
    width: 1.5rem;
  }
  .ant-btn {
    box-shadow: none;
    border: 1px solid #dedede;
    border-radius: 2px;
  }
  .ant-btn-group .ant-btn-primary:last-child:not(:first-child),
  .ant-btn-group .ant-btn-primary + .ant-btn-primary {
    border-left-color: #dedede;
  }
`;

interface Props {
  userId: string;
  isModalVisible: boolean;
  setIsModalVisible: any;
}

const ObjWeightage = (props: Props) => {
  const [IsPageLoaded, setIsPageLoaded] = useState(false);
  const [Data, setData] = useState<any>([]);
  const [updateData, setUpdateData] = useState<any>([]);
  const [CurrentCycle, setCurrentCycle] = useState();
  const [CurrentTimeline, setCurrentTimeline] = useState("");
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [isExpand, setisExpand] = useState(false);
  const [isLockWeightage, setIsLockWeightage] = useState(false);
  const [totalWeightage, setTotalWeightage] = useState<number>(0);
  const [totalProgress, setTotalProgress] = useState<number>(0);
  const [isDistributeEqually, setIsDistributeEqually] = useState<boolean>(
    false,
  );
  const [userName, setUserName] = useState<string>("");

  const EnabledModule = state?.product_settings?.settings;
  const roles = state?.roles?.role;
  const _HasPermission = (key: any) => {
    return HasPermission(key, roles, EnabledModule, state);
  };

  useEffect(() => {
    setisExpand(!!state?.isExpand);
    setCurrentTimeline(filter.performance_cycle);
  }, [state, CurrentTimeline]);

  const getData = () => {
    setIsPageLoaded(false);
    if (CurrentTimeline) {
      HttpService.get(
        `objectives/user-objectives/${CurrentTimeline}`,
        {},
        {
          performance_cycle: CurrentTimeline,
          user_id: props.userId,
          // objective_id:
        },
      )
        .then(res => {
          if (res.length > 0) {
            setData(res);
          }
        })
        .catch(() => {
          notification.error({
            message: "Error",
            description: "Problem loading Objectives",
          });
        });
    }
  };
  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
  }, []);

  const calcTotalWeightage = () => {
    if (updateData.length > 0) {
      let tempTotalWeightage = 0;
      let tempToatlProgress = 0;
      updateData.forEach((item: any, index: number) => {
        tempTotalWeightage += item.user_objective_weightage ?? 0;
        tempToatlProgress += item.user_objective_progress ?? 0;
      });
      if (isFinite(tempTotalWeightage) && !isNaN(tempTotalWeightage)) {
        setTotalWeightage(tempTotalWeightage);
      } else {
        setTotalWeightage(0);
      }
      if (isFinite(tempToatlProgress) && !isNaN(tempToatlProgress)) {
        setTotalProgress(tempToatlProgress);
      } else {
        setTotalProgress(0);
      }
    }
  };

  useEffect(() => {
    if (Data.length > 0) {
      setUserName(Data[0]["display_name"]);
      const tempStateData: any = [];
      Data.forEach((item: any, index: number) => {
        if (item.lock_weightage) {
          setIsLockWeightage(true);
        }
        tempStateData.push({
          id: item.id,
          objective_user_progress_id: item.objective_user_progress_id,
          user_objective_progress: parseInt(item.user_objective_progress),
          user_id: item.user_id,
          user_objective_weightage: parseInt(item.user_objective_weightage),
          updated_by: state?.user?.id,
          lock_weightage: item.lock_weightage,
          display_name: item.display_name,
          profile_photo: item.profile_photo,
          objective_type: item.objective_type,
          is_shared: item.is_shared,
          description: item.description,
        });
      });
      // console.log(`tempStateData: ${JSON.stringify(tempStateData)}`);
      setUpdateData(tempStateData);
    }
  }, [Data]);

  useEffect(() => {
    if (CurrentTimeline) {
      getData();
    }
  }, [CurrentTimeline]);

  const handleWeightageChange = (e: any, index: number) => {
    const tempStateData: any = [...updateData];
    tempStateData[index]["user_objective_weightage"] = parseInt(e);
    setUpdateData(tempStateData);
  };

  const equallyDistributeWeightage = () => {
    if (updateData.length > 0) {
      let tempStateData = updateData;
      const tempWeightage = Math.floor(100 / tempStateData.length);
      let total: number = 0;
      tempStateData?.forEach((item: any, index: number) => {
        if (index < tempStateData?.length - 1) {
          item.user_objective_weightage = tempWeightage;
          total += tempWeightage;
        }
        if (index === tempStateData?.length - 1) {
          item.user_objective_weightage = 100 - total;
        }
      });
      setUpdateData(tempStateData);
      calcTotalWeightage();
    }
  };

  useEffect(() => {
    if (isLockWeightage && updateData.length > 0) {
      const tempStateData: any = [...updateData];
      tempStateData?.forEach((item: any, index: number) => {
        item.lock_weightage = true;
      });
      setUpdateData(tempStateData);
    }
  }, [isLockWeightage]);

  useEffect(() => {
    calcTotalWeightage();
  }, [updateData]);

  const onUpdateWeightage = () => {
    if (updateData.length > 0) {
      const tempData = [...updateData];
      tempData.forEach((item: any) => {
        delete item.user_objective_progress;
        delete item.display_name;
        delete item.profile_photo;
        delete item.objective_type;
        delete item.is_shared;
        delete item.description;
      });
      console.log(`final temp data: ${tempData}`);
      HttpService.put("objectives/edit", "objectives-weightage", {
        objectives: tempData,
      })
        .then(res => {
          notification.success({
            message: "Success",
            description: "Data Updated successfully",
          });
          props.setIsModalVisible(false);
        })
        .catch(err => {
          notification.error({
            message: "Error",
            description: "Problem while updating objectives weightage",
          });
        });
    }
  };

  return (
    <Modal
      visible={props.isModalVisible}
      title={`${userName} : Edit Objective Weightage`}
      width={760}
      footer={[
        <Row>
          <Col span={10} style={{ textAlign: "left" }}>
            <Checkbox
              checked={isDistributeEqually}
              onChange={(e: any) => {
                if (e.target.checked) {
                  equallyDistributeWeightage();
                  setIsDistributeEqually(true);
                } else {
                  setIsDistributeEqually(false);
                }
              }}
            >
              Distribute Equally
            </Checkbox>
          </Col>
          <Col span={10} style={{ textAlign: "left" }}>
            {state?.user?.is_manager && (
              <Checkbox
                checked={isLockWeightage}
                onChange={(e: any) => {
                  if (e.target.checked) {
                    setIsLockWeightage(true);
                  } else {
                    setIsLockWeightage(false);
                  }
                }}
              >
                Lock Weightage
              </Checkbox>
            )}
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              disabled={totalWeightage !== 100}
              onClick={() => onUpdateWeightage()}
            >
              Submit
            </Button>
          </Col>
        </Row>,
      ]}
      onCancel={() => {
        props.setIsModalVisible(false);
      }}
    >
      <Wrapper>
        <Row>
          <Row className="c-table fw">
            <Col span={16} style={{ fontWeight: 600 }}>
              Objective Description
            </Col>
            <Col span={4} style={{ textAlign: "right", fontWeight: 600 }}>
              Weightage
            </Col>
            <Col span={4} style={{ textAlign: "right", fontWeight: 600 }}>
              Progress
            </Col>
          </Row>
          {updateData?.map((item: any, index: number) => (
            <Row justify={"space-around"} className="c-table fw">
              <Col span={16}>
                <Row>
                  <Col span={3} style={{ textAlign: "center" }}>
                    <ObjectiveTypeAvatar
                      type={"user"}
                      name={item.display_name}
                      image={item.profile_photo}
                    />
                  </Col>
                  <Col span={17}>{item.description}</Col>
                  <Col span={3}>
                    <ObjectiveTypeAvatar
                      type={item.objective_type}
                      name={item.display_name}
                      image={item.user_pic}
                    />
                    &nbsp;
                    <Tooltip title={item.is_shared ? "Shared" : ""}>
                      <ShareAltOutlined
                        style={{
                          fontSize: "large",
                          color: `${item.is_shared ? "#000000" : "#ffffff"}`,
                          fontWeight: 600,
                        }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
              <Col span={3} style={{ textAlign: "right" }}>
                <Input
                  type="number"
                  disabled={isLockWeightage}
                  defaultValue={item.user_objective_weightage ?? 0}
                  value={item.user_objective_weightage ?? 0}
                  onChange={e => {
                    handleWeightageChange(e.target.value, index);
                  }}
                />
              </Col>
              <Col span={3} style={{ textAlign: "center" }}>
                {item?.user_objective_progress ?? 0}%
              </Col>
            </Row>
          ))}
          <Row className="c-table fw">
            <Col span={16} style={{ textAlign: "right", fontWeight: 600 }}>
              Total
            </Col>
            <Col span={4} style={{ textAlign: "center", fontWeight: 600 }}>
              {totalWeightage}
            </Col>
            <Col span={4} style={{ textAlign: "center", fontWeight: 600 }}>
              {totalProgress}
            </Col>
          </Row>
        </Row>
      </Wrapper>
    </Modal>
  );
};

export default ObjWeightage;
