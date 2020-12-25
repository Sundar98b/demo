import _ from "lodash-es";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Form, InputNumber, Select, Tooltip, notification } from "antd";
import { useSelector } from "react-redux";

import HttpService from "../../../services/httpService";
import ObjectiveTypeAvatar from "../../../components/org-type";
import SKLoader from "../../../components/skloader";
import Utils from "../../../utils";

const Wrapper = styled.div`
  height: 66vh;
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
const Table = styled.table`
  width: 100%;
  background: #fff;

  tbody > tr:nth-child(1) > td:nth-child(1) {
    width: 70px !important;
  }

  input[type="number"] {
    border: var(--light-bdr);
    height: 30px;
    width: 100%;
    padding-left: 8px;
  }
  tfoot td {
    text-align: center;
  }
`;
const Card = styled.div`
  background: #fff;
  padding: 3px 12px;
`;

const ObjectiveWeightage: React.FC = () => {
  const [IsPageLoaded, setIsPageLoaded] = useState(false);
  const [Data, setData] = useState<any>([]);
  const [Users, setUsers] = useState<any>([]);
  const [CurrentCycle, setCurrentCycle] = useState();
  const [disableAprroveAll, setDisableAprroveAll] = useState(true);
  const state = useSelector((state: any) => state.INITIAL_DATA);

  const [isExpand, setisExpand] = useState(false);

  useEffect(() => {
    setisExpand(!!state?.isExpand);
  }, [state]);

  const checkApproveAll = (tempUsers: any) => {
    let temp = false;
    tempUsers.forEach((element: any) => {
      temp =
        Math.round(element["totalWeightage"] * 100) / 100 === 100 && !temp
          ? false
          : true;
    });
    setDisableAprroveAll(temp);
  };
  const getData = () => {
    setIsPageLoaded(false);
    HttpService.get("objectives/obj-weightage/" + CurrentCycle)
      .then(res => {
        const unsortedUsers = res.users;
        const sortedUsers = _.orderBy(unsortedUsers, ["display_name"], ["asc"]);
        setData(res.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const tempUsers = sortedUsers?.map((item: any) => {
          item["disableApproval"] = true;
          let totalWeightage: number = 0;
          res.data?.forEach((obj: any) => {
            obj.users?.forEach((u: any) => {
              if (item["id"] === u["id"]) {
                totalWeightage += u["weightage"];
              }
            });
          });
          item["disableApproval"] =
            Math.round(totalWeightage * 100) / 100 === 100 ? false : true;
          item["totalWeightage"] = Math.round(totalWeightage * 100) / 100;
          return item;
        });
        checkApproveAll(sortedUsers);
        setUsers(sortedUsers);
        setIsPageLoaded(true);
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Problem loading Objectives",
        });
      });
  };
  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (CurrentCycle) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentCycle]);
  const calcTotalWeightage = (tempData: any) => {
    const tempUsers: any = Users?.map((item: any) => {
      item["disableApproval"] = true;
      let totalWeightage: number = 0;
      tempData?.forEach((obj: any) => {
        obj.users?.forEach((u: any) => {
          if (item["id"] === u["id"]) {
            totalWeightage += u["weightage"];
          }
        });
      });
      item["disableApproval"] =
        Math.round(totalWeightage * 100) / 100 === 100 ? false : true;
      item["totalWeightage"] = Math.round(totalWeightage * 100) / 100;
      return item;
    });
    setUsers(tempUsers);
    checkApproveAll(tempUsers);
  };
  let handleWeightageChange = (e: any, userIndex: number, objIndex: number) => {
    const tempData: any = Data;
    if (
      tempData &&
      objIndex < tempData.length &&
      Array.isArray(tempData[objIndex]["users"]) &&
      userIndex < tempData[objIndex]["users"].length
    ) {
      tempData[objIndex]["users"][userIndex]["weightage"] = e;
      calcTotalWeightage(tempData);
      setData([...tempData]);
    }
  };
  const onUpdateWeightage = (all: boolean, id?: string) => {
    if (Data) {
      const tempData = [...Data];
      const items: any = [];
      if (all === false && id) {
        tempData?.forEach((obj: any) => {
          if (obj && obj["users"]) {
            obj.users?.forEach((u: any) => {
              if (u["id"] === id && u["has_obj"]) {
                items.push({
                  weightage: u.weightage,
                  user_id: u.id,
                  rel_obj: obj.rel_obj,
                });
              }
            });
          }
        });
      } else if (all === true) {
        tempData?.forEach((obj: any) => {
          if (obj && obj["users"]) {
            obj.users?.forEach((u: any) => {
              if (u["has_obj"]) {
                items.push({
                  weightage: u.weightage,
                  user_id: u.id,
                  rel_obj: obj.rel_obj,
                });
              }
            });
          }
        });
      }
      HttpService.post("objectives/obj-weightage/", {
        performance_cycle: CurrentCycle,
        objectives: items,
      })
        .then(res => {
          notification.success({
            message: "Success",
            description: "Data Updated successfully",
          });
          getData();
        })
        .catch(err => {
          notification.error({
            message: "Error",
            description: "Problem while updating objectives weightage",
          });
        });
    }
  };
  handleWeightageChange = _.debounce(handleWeightageChange, 500);

  return (
    <Wrapper>
      <Card>
        <Form.Item label="Performance Cycle">
          <Select
            value={CurrentCycle}
            onChange={(val: any) => setCurrentCycle(val)}
            style={{ width: "200px" }}
          >
            {state?.app_settings?.settings?.cycles?.map((item: any) => (
              <Select.Option key={item.name} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Card>
      {!IsPageLoaded && <SKLoader />}
      {IsPageLoaded && (
        <>
          <Table className="c-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}></th>
                <th>Objective Description</th>
                <th>Target</th>
                {Users?.map((user: any) => (
                  <th key={user.id}>{user.display_name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Data?.map((item: any, objIndex: number) => (
                <tr key={objIndex}>
                  <td>
                    <ObjectiveTypeAvatar
                      name={item.user_name}
                      type={item.type}
                      image={item.user_pic}
                    />
                  </td>
                  <td>
                    <div className="_250px" style={{ width: "200px" }}>
                      {isExpand && <div>{item.description}</div>}
                      {!isExpand && (
                        <Tooltip title={item.description}>
                          <div className="truncate">{item.description}</div>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                  <td> {item.target} </td>
                  {item.users?.map((user: any, userIndex: number) => (
                    <>
                      <td key={userIndex}>
                        {user.has_obj && (
                          <InputNumber
                            min={0}
                            step={0.01}
                            max={100}
                            value={Utils.round(user.weightage)}
                            onChange={e =>
                              handleWeightageChange(e, userIndex, objIndex)
                            }
                          />
                        )}
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
            <tbody className="is-total">
              <tr>
                <td style={{ textAlign: "center" }} colSpan={2}></td>
                <td></td>
                {Users.map((user: any) => (
                  <td key={user.id}>
                    {/* <input type="number" min="0" value="100" step="0.01" /> */}
                    {user["totalWeightage"]}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ textAlign: "center" }} colSpan={2}>
                  <Button
                    type="primary"
                    disabled={disableAprroveAll}
                    onClick={() => onUpdateWeightage(true)}
                  >
                    Approve All
                  </Button>
                </td>
                <td></td>

                {Users?.map((user: any) => (
                  <td key={user.id}>
                    <Button
                      type="primary"
                      disabled={user["disableApproval"]}
                      onClick={() => onUpdateWeightage(false, user.id)}
                    >
                      Approve
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </Wrapper>
  );
};

export default ObjectiveWeightage;
