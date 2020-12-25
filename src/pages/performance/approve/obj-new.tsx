import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Tooltip, message, notification } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import EmptyImg from "../../../components/empty";
import HttpService from "../../../services/httpService";
import KR from "../my-okr/kr";
import ObjectiveTypeAvatar from "../../../components/org-type";
import SKLoader from "../../../components/skloader";
import UserChip from "../../../components/user-chip";

const Objective = styled.div`
  background: #fff;
  padding: 4px;
  border: 1px dotted #d90941;
  border-radius: 3px;

  &:hover {
    background-color: #fcfcfc;
  }
  .id-tag {
    background: transparent none repeat scroll 0 0;
    border: 1px solid #aaa;
    border-radius: 100px;
    color: #777;
    height: 40px;
    width: 40px;
    > span {
      position: relative;
      top: 20%;
      left: 20%;
      transform: translate(-50%, -50%);
    }
  }
  img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 11px;
  }
`;

const Wrapper = styled.div`
  height: 75vh;
  overflow-y: auto;
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
const KeyResultsWrap = styled.div`
  background: #fff;
  padding: 3px;
  margin: 3px 8px;
  margin-top: 1px;
  padding-left: 21px;
  padding-top: 20px;
`;

interface ObjectiveNew {
  onChange: Function;
}
const ObjectiveNew: React.FC<ObjectiveNew> = props => {
  const [isLoaded, setisLoaded] = useState(false);
  const [Objectives, setObjectives] = useState([]);
  const [reFreshToken, setreFreshToken] = useState(1);
  const [OpenedKR, setOpenedKR]: [any, Function] = useState([]);
  const state = useSelector((state: any) => state.INITIAL_DATA);

  const [isExpand, setisExpand] = useState(false);

  useEffect(() => {
    setisExpand(!!state?.isExpand);
  }, [state]);
  useEffect(() => {
    HttpService.get("objectives/approval").then(res => {
      setObjectives(res);
      setisLoaded(true);
    });
  }, [reFreshToken]);

  const Approve = (id: string) => {
    message.loading("Approving ...");
    HttpService.put("objectives/actions/approve", id, {
      status: "approved",
    })
      .then(res => {
        notification.success({
          message: "Approved",
          description: "Objective approved Successfully",
        });
        props.onChange();
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Problem while updating the Objectives",
        });
      })
      .finally(() => {
        message.destroy();
        setreFreshToken(reFreshToken + 1);
      });
  };
  const OpenKeyResults = (id: string, key: number) => {
    const newState = [...OpenedKR];
    if (!newState.includes(id)) {
      newState.push(id);
    } else {
      newState.splice(newState.indexOf(id));
    }
    setOpenedKR(newState);
  };

  return (
    <Wrapper>
      {!isLoaded && <SKLoader count={6} />}
      {isLoaded && !Objectives.length && (
        <EmptyImg description="There is no new item" />
      )}
      {isLoaded && (
        <>
          {Objectives.map((item: any, index) => (
            <div key={index}>
              <Objective>
                <Row>
                  <Col span={1} className="text-center">
                    <ObjectiveTypeAvatar
                      type={item.objective_type}
                      name={item.user_name}
                      image={item.user_pic}
                    />
                  </Col>
                  <Col span={20}>
                    <div
                      className="_250px"
                      style={{ width: "300px !important" }}
                    >
                      {isExpand && (
                        <h3>
                          <a
                            href={"#" + item.id}
                            onClick={e => {
                              e.preventDefault();
                              OpenKeyResults(item.id, index);
                            }}
                          >
                            {item.description}
                          </a>
                        </h3>
                      )}
                      {!isExpand && (
                        <Tooltip title={item.description}>
                          <h3 className="truncate">
                            <a
                              href={"#" + item.id}
                              onClick={e => {
                                e.preventDefault();
                                OpenKeyResults(item.id, index);
                              }}
                            >
                              {item.description}
                            </a>
                          </h3>
                        </Tooltip>
                      )}
                    </div>
                    <div>
                      <UserChip name={item.user_name} img={item.user_pic} />
                      &nbsp;
                      <span style={{ verticalAlign: "top" }}>
                        {moment(item.updated_on).format("DD-MMM-YYYY")}
                        {/* (&nbsp; {moment(item.updated_on).fromNow()}) */}
                      </span>
                    </div>

                    {item.kr_weightage !== "100" && (
                      <Alert
                        type="error"
                        showIcon
                        closable
                        message={
                          "Unable to approve the objective total weightage is more than 100%"
                        }
                      />
                    )}
                  </Col>
                  <Col span={3}>
                    <br />
                    <Button
                      type="primary"
                      onClick={() => Approve(item.id)}
                      disabled={item.kr_weightage !== "100"}
                    >
                      Approve
                    </Button>
                  </Col>
                </Row>
              </Objective>
              {OpenedKR.includes(item.id) && (
                <KeyResultsWrap>
                  <KR
                    count={parseInt(item.no_of_kr, 10)}
                    refreshToken={v4()}
                    objective_id={item.id}
                    expand={false}
                    is_admin={true}
                  />
                </KeyResultsWrap>
              )}
            </div>
          ))}
        </>
      )}
    </Wrapper>
  );
};

export default ObjectiveNew;
