import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  notification,
} from "antd";
import { useSelector } from "react-redux";

import HttpService from "../../../services/httpService";
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

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

const EditRating = (props: any) => {
  const [form] = Form.useForm();
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(undefined);
  const [appCycle, setAppCycles] = useState<any>([]);
  const [CurrentTimeline, setCurrentTimeline] = useState<any>("");
  const [selectedCycle, setSelectedCycle] = useState<any>(undefined);
  const [empData, setEmpData] = useState<any>(undefined);
  const [isAdmin, setisAdmin] = useState<boolean>(false);
  const [prSettings, setPrSettings] = useState<any>(undefined);
  const [reviewCycle, setReviewCycle] = useState<any>(undefined);
  const [managerTimeLine, setManagerTimeLine] = useState<any>({
    ManagerReviewStartDate: undefined,
    ManagerReviewEndDate: undefined,
  });
  const [prData, setPrData] = useState<any>(undefined);
  const [formValues, setFormValues] = useState<any>(undefined);
  const [levelData, setLevelData] = useState<any>([]);
  const [myRating, setMyRating] = useState<any>({});
  const [myRatingEdit, setMyRatingEdit] = useState<boolean>(false);
  const [adminOverride, setAdminOverride] = useState<boolean>(false);
  const [isAdminDataChanged, setIsAdminDataChanged] = useState<boolean>(false);
  const [isMyRatingDataChanged, setIsMyRatingDataChanged] = useState<boolean>(
    false,
  );

  useEffect(() => {
    setisAdmin(
      state?.roles.name === "Org Admin" ||
        state?.roles.name === "Product Admin",
    );
    if (state && state.app_settings && state.app_settings.settings.cycles) {
      setAppCycles(state.app_settings.settings.cycles);
    }
    setCurrentTimeline(filter.performance_cycle);
    setPrSettings(state?.prSettings ?? undefined);
    setLoggedInUser(state?.user ?? undefined);
  }, [state]);

  useEffect(() => {
    setEmpData(props.data);
  }, [props]);

  useEffect(() => {
    let selectedCycle: any = undefined;
    appCycle.forEach((item: any) => {
      if (item.name === CurrentTimeline) {
        selectedCycle = item;
      }
    });
    setSelectedCycle(selectedCycle);
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

  useEffect(() => {
    if (empData?.user_id && reviewCycle && empData?.line_manager) {
      HttpService.get(
        `performance/review-rating`,
        {},
        {
          review_cycle: reviewCycle,
          user_id: empData?.user_id,
          line_manager: empData?.line_manager,
        },
      )
        .then(res => {
          setPrData(res ?? undefined);
          setFormValues(res ?? undefined);
          console.log(`res: ${JSON.stringify(res)}`);
        })
        .catch(err => {});

      //console.log(`user: ${JSON.stringify(props.user)}`)
    }
  }, [empData, reviewCycle]);

  useEffect(() => {
    let TempLevelData: any = [];
    //let superiorsData: any = [];
    if (prData?.superiors?.length) {
      prData?.superiors?.map((item: any) => {
        TempLevelData.push({
          user_id: item.id ?? undefined,
          is_ceo: item.is_ceo ?? undefined,
          line_manager: item.line_manager ?? undefined,
          profile_photo: item.profile_photo ?? undefined,
          user_level: item.user_level ?? undefined,
          display_name: item.display_name ?? undefined,
          department: item.department ?? undefined,
          tenant_id: item.tenant_id ?? prData?.tenant_id,
          prr_id: item.prr_id ?? prData?.id, //performance review rating id
          level_user_id: item.level_user_id ?? item.id, // manager id
          level_user_status: item.level_user_status ?? "yet_to_submit", //status
          review_rating: item.review_rating ?? undefined, // superior entered value
          promotion: item.promotion ?? false,
          training: item.training ?? false,
          promotion_remarks: item.promotion_remarks ?? undefined,
          training_remarks: item.training_remarks ?? undefined,
          overall_remarks: item.overall_remarks ?? undefined,
        });
      });
    } else if (prData?.manager_levels?.length) {
      prData?.manager_levels?.forEach((item: any) => {
        TempLevelData.push({
          id: item.id ?? undefined,
          is_ceo: item.is_ceo ?? undefined,
          tenant_id: item.tenant_id ?? prData?.tenant_id,
          prr_id: item.prr_id ?? prData?.id, //performance review rating id
          user_id: item.user_id ?? undefined, // user id
          user_level: item.user_level ?? undefined,
          level_user_id: item.level_user_id ?? undefined, // manager id
          level_user_status: item.level_user_status ?? undefined,
          review_rating: item.review_rating ?? undefined, // superior entered value
          promotion: item.promotion ?? undefined,
          training: item.training ?? undefined,
          promotion_remarks: item.promotion_remarks ?? undefined,
          training_remarks: item.training_remarks ?? undefined,
          overall_remarks: item.overall_remarks ?? undefined,
          display_name: item.display_name ?? undefined,
          department: item.department ?? undefined,
          line_manager: item.line_manager ?? undefined,
          profile_photo: item.profile_photo ?? undefined,
        });
      });
    }
    setLevelData(TempLevelData);
  }, [prData]);

  useEffect(() => {
    if (levelData?.length) {
      levelData.forEach((item: any) => {
        if (loggedInUser.id === item.user_id) {
          setMyRating(item);
        }
      });
    }
  }, [levelData]);

  useEffect(() => {
    let tempReviewTimeline: any =
      prSettings?.review_timeline?.timeline?.cycles ?? undefined;
    let tempManagerReviewStartDate: any = undefined;
    let tempManagerReviewEndDate: any = undefined;
    tempReviewTimeline?.map((item: any) => {
      if (item.name === reviewCycle) {
        tempManagerReviewStartDate = item?.managerReviewStart
          ? moment(item?.managerReviewStart)
          : undefined;
        tempManagerReviewEndDate = item?.managerReviewEnd
          ? moment(item?.managerReviewEnd)
          : undefined;
      }
    });
    setManagerTimeLine({
      ManagerReviewStartDate: tempManagerReviewStartDate,
      ManagerReviewEndDate: tempManagerReviewEndDate,
    });
  }, [prSettings, reviewCycle]);

  useEffect(() => {
    let isPreviousManagerSubmitted: any = false;
    if (
      moment() >= managerTimeLine?.ManagerReviewStartDate &&
      moment() <= managerTimeLine?.ManagerReviewEndDate
    ) {
      if (prData?.admin_status !== "submitted" && isAdmin) {
        setAdminOverride(true);
      } else {
        setAdminOverride(false);
      }

      if (myRating?.user_level > 1) {
        levelData?.forEach((item: any) => {
          if (item.user_level === myRating?.user_level - 1) {
            if (item?.level_user_status === "submitted") {
              isPreviousManagerSubmitted = true;
            } else {
              isPreviousManagerSubmitted = false;
            }
          }
        });
        if (
          myRating?.level_user_status === "submitted" ||
          !isPreviousManagerSubmitted
        ) {
          setMyRatingEdit(false);
        } else {
          setMyRatingEdit(true);
        }
      } else if (myRating?.user_level <= 1) {
        if (myRating?.level_user_status === "submitted") {
          setMyRatingEdit(false);
        } else {
          setMyRatingEdit(true);
        }
      }
    }
  }, [prData, isAdmin, managerTimeLine, myRating, levelData]);

  const onChange = (name: any, value: any, item: any, isAdmin1: boolean) => {
    //console.log(`name:${name},value: ${value}, item: ${JSON.stringify(item)}, isAdmin: ${isAdmin}`);
    if (isAdmin1) {
      let tempAdminValues: any = { ...formValues };
      tempAdminValues[name] = value;
      setFormValues(tempAdminValues);
      setIsAdminDataChanged(true);
    } else {
      let tempListData: any = [...levelData];
      let tempMyRating: any = { ...myRating };
      tempMyRating[name] = value;
      tempListData?.forEach((item: any) => {
        if (item.user_level >= myRating.user_level) {
          item[name] = value;
        }
      });
      //console.log(`myRating: ${JSON.stringify(tempMyRating)}`)
      //console.log(`levelData: ${JSON.stringify(tempListData)}`)
      setMyRating(tempMyRating);
      setLevelData(tempListData);
      setIsMyRatingDataChanged(true);
      if (!isAdmin) {
        let tempAdminValues: any = { ...formValues };
        switch (name) {
          case "review_rating":
            tempAdminValues["admin_overall"] = value;
            break;
          case "promotion":
            tempAdminValues["admin_promotion"] = value;
            break;
          case "training":
            tempAdminValues["admin_training"] = value;
            break;
          case "overall_remarks":
            tempAdminValues["admin_overall_remarks"] = value;
            break;
          case "promotion_remarks":
            tempAdminValues["admin_promotion_remarks"] = value;
            break;
          case "training_remarks":
            tempAdminValues["admin_training_remarks"] = value;
            break;
          default:
            break;
        }
        //console.log(`myRating: ${JSON.stringify(tempAdminValues)}`)
        setFormValues(tempAdminValues);
      }
    }
  };

  const onSubmit = () => {
    setLoading(true);
    if (prData?.id && levelData) {
      let tempLevelData: any = [...levelData];
      tempLevelData.forEach((item: any) => {
        delete item.is_ceo;
        delete item.display_name;
        delete item.department;
        delete item.line_manager;
        delete item.profile_photo;
        if (item?.user_id === myRating?.user_id) {
          item.level_user_status = "submitted";
        } else if (
          item?.user_id !== myRating?.user_id &&
          item.user_level > myRating?.user_level
        ) {
          item.level_user_status = "yet_to_submit";
        }
      });
      const submitData: any = {
        id: prData?.id,
        tenant_id: prData?.tenant_id,
        prs_id: prData?.prs_id, //performance review setting id
        user_id: prData?.user_id,
        review_level: prData?.review_level,
        review_cycle: prData?.review_cycle,
        sys_calc_okr: prData?.sys_calc_okr,
        sys_calc_competence: prData?.sys_calc_competence,
        sys_calc_overall: prData?.sys_calc_overall,
        admin_id: isAdmin ? loggedInUser?.id : null,
        admin_overall: formValues?.admin_overall,
        admin_promotion: formValues?.admin_promotion,
        admin_remarks: formValues?.admin_remarks,
        admin_training: formValues?.admin_training,
        admin_promotion_remarks: formValues?.admin_promotion_remarks ?? "",
        admin_training_remarks: formValues?.admin_training_remarks ?? "",
        admin_overall_remarks: formValues?.admin_overall_remarks ?? "",
        admin_status: isAdminDataChanged ? "submitted" : "yet_to_submit",
        is_ceo: prData?.is_ceo, //check user is ceo or not
        manager_levels: tempLevelData ?? [],
        //superiors: prData?.superiors ?? []
      };
      console.log(`submit Data: ${JSON.stringify(submitData)}`);
      HttpService.put(
        "performance/update-review-rating",
        prData?.id,
        submitData,
      )
        .then(res => {
          setLoading(false);
          props.onModalClose();
        })
        .catch(() => {
          notification.error({
            description: "Something went wrong",
            message: "Error",
          });
        });
    }
  };

  const LevelsDisplay = (item: any) => {
    return (
      <Col
        span={5}
        offset={2}
        style={{
          border: "1px solid #d3d3d3",
          borderRadius: "5px",
          paddingLeft: "6px",
        }}
      >
        <Row style={{ width: "100%" }}>
          <Col span={24} style={{ textAlign: "center" }}>
            {item?.user_level && <b>LEVEL - {item.user_level}</b>}
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <UserChip name={item?.display_name} img={item?.profile_photo} />
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            {item?.level_user_status === "submitted"
              ? "SUBMITTED"
              : "YET TO SUBMIT"}
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col span={24}>
            <Form.Item label="Overall (%)">
              {item?.review_rating ?? ""}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>{item?.overall_remarks ?? "N/A"}</Form.Item>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col span={24}>
            <Form.Item label="Promotion">
              <Checkbox disabled checked={item?.promotion} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>{item?.promotion_remarks ?? "N/A"}</Form.Item>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col span={24}>
            <Form.Item label="Training">
              <Checkbox disabled checked={item?.training} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>{item?.training_remarks ?? "N/A"}</Form.Item>
          </Col>
        </Row>
      </Col>
    );
  };

  return (
    <>
      <Wrapper>
        <Row
          justify={"space-around"}
          style={{ marginTop: "10px", width: "100%" }}
        >
          <Col span={3} style={{ textAlign: "left" }}>
            {"Emp No"}
          </Col>
          <Col span={5} style={{ textAlign: "left" }}>
            {"Name"}
          </Col>
          <Col span={5} style={{ textAlign: "left" }}>
            {"Designation"}
          </Col>
          <Col span={5} style={{ textAlign: "left" }}>
            {"Department"}
          </Col>
          <Col span={2} style={{ textAlign: "center" }}>
            {"OKR"}
          </Col>
          <Col span={2} style={{ textAlign: "center" }}>
            {"Competence"}
          </Col>
          <Col span={2} style={{ textAlign: "center" }}>
            {"Overall"}
          </Col>
        </Row>
        <Row
          justify={"space-around"}
          style={{ margin: "5px auto", width: "100%" }}
        >
          <Col span={3} style={{ textAlign: "left" }}>
            <b>{prData?.employee_id ?? "N/A"}</b>
          </Col>
          <Col span={5} style={{ textAlign: "left" }}>
            <b>
              {prData?.display_name
                ? prData?.display_name.charAt(0).toUpperCase() +
                  prData?.display_name.slice(1)
                : "N/A"}
            </b>
          </Col>
          <Col span={5} style={{ textAlign: "left" }}>
            <b>
              {prData?.designation_name
                ? prData?.designation_name.charAt(0).toUpperCase() +
                  prData?.designation_name.slice(1)
                : "N/A"}
            </b>
          </Col>
          <Col span={5} style={{ textAlign: "left" }}>
            <b>
              {prData?.department_name
                ? prData?.department_name.charAt(0).toUpperCase() +
                  prData?.department_name.slice(1)
                : "N/A"}
            </b>
          </Col>
          <Col
            span={2}
            style={{
              textAlign: "center",
              color: redAmberGreen(prData?.sys_calc_okr ?? 0),
            }}
          >
            <b>{prData?.sys_calc_okr ?? 0}</b>
          </Col>
          <Col
            span={2}
            style={{
              textAlign: "center",
              color: redAmberGreen(prData?.sys_calc_competence ?? 0),
            }}
          >
            <b>{prData?.sys_calc_competence ?? 0}</b>
          </Col>
          <Col
            span={2}
            style={{
              textAlign: "center",
              color: redAmberGreen(prData?.sys_calc_overall ?? 0),
            }}
          >
            <b>{prData?.sys_calc_overall ?? 0}</b>
          </Col>
        </Row>
        <Row></Row>
        <Form
          //{...layout}
          //onFinish={value => onSubmit(value)}
          form={form}
          colon={false}
        >
          <Row justify={"space-around"} style={{ margin: "20px auto" }}>
            <Col span={4} style={{ margin: "10px auto" }}>
              <Row style={{ width: "100%" }}>
                <Col span={24}>
                  <b>{"My Rating"}</b>
                </Col>
                &nbsp;
                <Col span={24}>
                  <UserChip
                    name={loggedInUser?.username ?? ""}
                    img={loggedInUser?.profile_photo ?? undefined}
                  />
                </Col>
              </Row>
            </Col>
            <Col
              span={18}
              style={{ border: "1px solid #d3d3d3", borderRadius: "5px" }}
            >
              <Row style={{ width: "100%" }}>
                <Col span={7}>
                  <Row style={{ width: "100%" }}>
                    <Form.Item
                      {...layout}
                      label="Overall (%)"
                      //rules={[{ required: true, message: 'required' }]}
                    >
                      <InputNumber
                        value={myRating?.review_rating}
                        disabled={myRatingEdit ? false : true}
                        onChange={e => {
                          onChange("review_rating", e, myRating, false);
                        }}
                      />
                    </Form.Item>
                  </Row>
                  <Row style={{ width: "100%" }}>
                    <Form.Item {...layout} label="Promotion">
                      <Checkbox
                        checked={myRating?.promotion}
                        disabled={myRatingEdit ? false : true}
                        onChange={e => {
                          onChange(
                            "promotion",
                            e?.target?.checked,
                            myRating,
                            false,
                          );
                        }}
                      />
                    </Form.Item>
                  </Row>
                  <Row style={{ width: "100%" }}>
                    <Form.Item {...layout} label="Training">
                      <Checkbox
                        checked={myRating?.training}
                        disabled={myRatingEdit ? false : true}
                        onChange={e => {
                          onChange(
                            "training",
                            e?.target?.checked,
                            myRating,
                            false,
                          );
                        }}
                      />
                    </Form.Item>
                  </Row>
                </Col>
                <Col span={17}>
                  <Row style={{ width: "95%" }}>
                    <Form.Item>
                      <Input
                        placeholder="Overall Remarks"
                        value={myRating?.overall_remarks}
                        disabled={myRatingEdit ? false : true}
                        onChange={e => {
                          onChange(
                            "overall_remarks",
                            e?.target?.value,
                            myRating,
                            false,
                          );
                        }}
                      />
                    </Form.Item>
                  </Row>
                  <Row style={{ width: "95%" }}>
                    <Form.Item>
                      <Input
                        placeholder="Promotion Remarks"
                        value={myRating?.promotion_remarks}
                        disabled={myRatingEdit ? false : true}
                        onChange={e => {
                          onChange(
                            "promotion_remarks",
                            e?.target?.value,
                            myRating,
                            false,
                          );
                        }}
                      />
                    </Form.Item>
                  </Row>
                  <Row style={{ width: "95%" }}>
                    <Form.Item>
                      <Input
                        placeholder="Training Remarks"
                        value={myRating?.training_remarks}
                        disabled={myRatingEdit ? false : true}
                        onChange={e => {
                          onChange(
                            "training_remarks",
                            e?.target?.value,
                            myRating,
                            false,
                          );
                        }}
                      />
                    </Form.Item>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row
            justify={"space-around"}
            style={{ margin: "20px auto", width: "100%" }}
          >
            {levelData &&
              levelData.map((item: any) => {
                if (loggedInUser.id !== item.user_id) {
                  if (item.user_level > myRating.user_level) {
                    if (
                      item?.level_user_status === "submitted" &&
                      prSettings?.allow_managers_view_rating_high_level
                    ) {
                      return LevelsDisplay(item);
                    }
                  } else if (item.user_level < myRating.user_level) {
                    return LevelsDisplay(item);
                  }
                }
              })}
          </Row>
          {isAdmin && prSettings?.admin_rating_enabled_with_override && (
            <Row justify={"space-around"} style={{ margin: "20px auto" }}>
              <Col span={4} style={{ margin: "10px auto" }}>
                <Row style={{ width: "100%" }}>
                  <Col span={24}>
                    <b>{"Admin Rating"}</b>
                  </Col>
                  &nbsp;
                  <Col span={24}>
                    <UserChip
                      name={loggedInUser?.username ?? ""}
                      img={loggedInUser?.profile_photo ?? undefined}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                span={18}
                style={{ border: "1px solid #d3d3d3", borderRadius: "5px" }}
              >
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <Row style={{ width: "100%" }}>
                      <Form.Item {...layout} label="Overall (%)">
                        <InputNumber
                          value={formValues?.admin_overall}
                          disabled={!adminOverride}
                          onChange={e => {
                            onChange("admin_overall", e, {}, true);
                          }}
                        />
                      </Form.Item>
                    </Row>
                    <Row style={{ width: "100%" }}>
                      <Form.Item {...layout} label="Promotion">
                        <Checkbox
                          checked={formValues?.admin_promotion}
                          disabled={!adminOverride}
                          onChange={e => {
                            onChange(
                              "admin_promotion",
                              e?.target?.checked,
                              {},
                              true,
                            );
                          }}
                        />
                      </Form.Item>
                    </Row>
                    <Row style={{ width: "100%" }}>
                      <Form.Item {...layout} label="Training">
                        <Checkbox
                          checked={formValues?.admin_training}
                          disabled={!adminOverride}
                          onChange={e => {
                            onChange(
                              "admin_training",
                              e?.target?.checked,
                              {},
                              true,
                            );
                          }}
                        />
                      </Form.Item>
                    </Row>
                  </Col>
                  <Col span={17}>
                    <Row style={{ width: "95%" }}>
                      <Form.Item>
                        <Input
                          placeholder="Overall Remarks"
                          value={formValues?.admin_overall_remarks}
                          disabled={!adminOverride}
                          onChange={e => {
                            onChange(
                              "admin_overall_remarks",
                              e?.target?.value,
                              {},
                              true,
                            );
                          }}
                        />
                      </Form.Item>
                    </Row>
                    <Row style={{ width: "95%" }}>
                      <Form.Item>
                        <Input
                          placeholder="Promotion Remarks"
                          value={formValues?.admin_promotion_remarks}
                          disabled={!adminOverride}
                          onChange={e => {
                            onChange(
                              "admin_promotion_remarks",
                              e?.target?.value,
                              {},
                              true,
                            );
                          }}
                        />
                      </Form.Item>
                    </Row>
                    <Row style={{ width: "95%" }}>
                      <Form.Item>
                        <Input
                          placeholder="Training Remarks"
                          value={formValues?.admin_training_remarks}
                          disabled={!adminOverride}
                          onChange={e => {
                            onChange(
                              "admin_training_remarks",
                              e?.target?.value,
                              {},
                              true,
                            );
                          }}
                        />
                      </Form.Item>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={2}></Col>
            </Row>
          )}
          <Row justify={"end"} style={{ margin: "20px auto" }}>
            <Col span={3}>
              <Button
                style={{
                  width: "80%",
                  border: "1px solid #d3d3d3",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  props.onModalClose();
                }}
              >
                Cancel
              </Button>
            </Col>
            <Col span={3}>
              <Button
                style={{ width: "80%" }}
                type={"primary"}
                loading={loading}
                disabled={myRatingEdit ? false : true}
                onClick={() => onSubmit()}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Wrapper>
    </>
  );
};

export default EditRating;
