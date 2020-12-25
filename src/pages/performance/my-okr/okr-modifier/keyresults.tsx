import moment from "moment";
import styled from "styled-components";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
  Tooltip,
  message,
  notification,
} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  ForkOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { v4 } from "uuid";

import HttpService from "../../../../services/httpService";
import Select2 from "../../../../components/select2";
import SubKR from "./subkr";
import { useTimeout } from "../../../../hooks/useTimout";

const Btn = styled.button`
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  cursor: pointer;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0);
  background-color: #fff;
  border-color: #d9d9d9;
  color: rgba(0, 0, 0, 0);
  background-color: #fff;
  border-color: #d9d9d9;
  border-style: dashed;
  &[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
`;

const KRS = styled.div`
  > div {
    border-left: 2px solid #009688;
    margin-left: 17px;
    margin-top: -12px;
    padding-top: 20px;
  }

  .card {
    margin-left: 28px;
    &::before {
      border-top: 2px solid #009688;
      content: "";
      height: 0;
      position: absolute;
      left: -31px !important;
      top: 1.4em;
      width: 32px;
      margin-top: -1px;
    }
  }
`;
const Obj = styled.div`
  background: #f7f7f7;
  padding: 8px;
  border: var(--light-bdr);
  font-weight: bolder;
  margin-bottom: 12px;
  position: relative;
  margin-top: 4px;
  .ant-form-item-label > label::after {
    content: "";
  }
  /* .ant-radio-group {
    position: absolute;
    right: 0;
    top: -1px;
  } */
`;
const Footer1 = styled.div`
  position: absolute;
  z-index: 12;
  bottom: 10px;
  .ant-btn {
    margin-left: 12px;
  }
`;

const Footer = styled.div`
  position: absolute;
  z-index: 12;
  right: 7px;
  bottom: 10px;
  .ant-btn {
    margin-left: 12px;
  }
`;

interface KeyResults {
  weightage: Function;
  objective_id: string;
  cycle: string;
  performance_cycle: string;
  start: string;
  end: string;
  kpi: boolean;
  assignRule: string;
  objectiveType: string;
  user_id: string;
  user_name: string;
  items?: any[];
  isEditPage?: boolean;
  onSubKR?: Function;
}

const KeyResults: React.FC<KeyResults> = props => {
  const [SubKRData, setSubKRData] = useState({
    start: "",
    end: "",
    description: "",
    objectiveType: "",
    index: 0,
  });
  const [SubKRVisible, setSubKRVisible] = useState(false);
  const [form] = Form.useForm();
  const [SubKRInputs, setSubKRInputs]: [any, Function] = useState({});
  const [AssignToEndPoints, setAssignToEndPoints] = useState("users");
  const [isActivity, setIsActivity] = useState<any[]>([false]);
  const [helper, setHelper] = useState<any>({});
  const [isWeightageChanged, setIsWeightageChanged] = useState<any>(true);
  useEffect(() => {
    if (props.assignRule !== "private") {
      setAssignToEndPoints("users");
    } else {
      if (
        props.objectiveType === "team" ||
        props.objectiveType === "organization"
      ) {
        setAssignToEndPoints("users/direct-reportees");
      } else if (props.objectiveType === "cross_team") {
        setAssignToEndPoints("users/secondary-reportees");
      } else if (props.objectiveType === "own") {
        setAssignToEndPoints("users/direct-reportees");
      }
    }
  }, [props.assignRule, props.objectiveType]);

  useTimeout(() => {
    CanSubmit();
  }, 700);

  useEffect(() => {
    setIsWeightageChanged(true);
    const tempIsActivity: any[] = [...isActivity];
    tempIsActivity[0] = false;
    let initialValues = {
      user_id: props.user_id,
      boundaries: "none",
      start_date: moment(props.start),
      end_date: moment(props.end),
      weightage: 100,
    };
    form.setFieldsValue({
      items: [initialValues],
    });
    setIsActivity(tempIsActivity);
  }, [form, props.user_id]);

  useEffect(() => {
    if (props.items?.length) {
      setIsWeightageChanged(false);
      let items: any = [];
      const tempIsActivity: any[] = [...isActivity];
      props.items?.map((item: any, index: number) => {
        item.start = moment(item.start);
        item.end = moment(item.end);
        items.push({
          description: item.description,
          user_id: item.user_id,
          weightage: item.weightage,
          kpi: item.kpi,
          uom: item.uom,
          boundaries: item.boundaries,
          starting: item.starting,
          target: item.target,
          start_date: props?.isEditPage
            ? moment(item.start_date)
            : moment(props.start),
          end_date: props?.isEditPage
            ? moment(item.end_date)
            : moment(props.end),
          is_activity: !!item.is_activity,
          activity_description: item.activity_description,
        });
        tempIsActivity[index] = item.is_activity ?? false;
        return item;
      });
      setIsActivity(tempIsActivity);
      form.setFieldsValue({
        items: items,
      });
    }
  }, [form, props.isEditPage, props.items]);
  const history = useHistory();

  const CanSubmit = () => {
    let total = 0;
    const formData = form.getFieldsValue();
    formData.items.forEach((item: any) => {
      total += item.weightage;
    });
    props.weightage(total);
  };

  const onSwtichChange = (value: any, field: any) => {
    const tempIsActivity: any[] = [...isActivity];
    if (field.fieldKey !== undefined) {
      if (value) {
        tempIsActivity[field.fieldKey] = true;
      } else {
        tempIsActivity[field.fieldKey] = false;
      }
    } else {
      tempIsActivity[field.fieldKey] = false;
    }
    setIsActivity(tempIsActivity);
  };

  const onSubmit = (type: string) => {
    form
      .validateFields()
      .then(() => {
        const val = form.getFieldsValue();
        const newSubKRInputs = { ...SubKRInputs };
        let total: number = 0;

        const newItems: any = val.items.map((item: any, index: number) => {
          item.start_date = moment(item.start_date).format("DD-MM-YYYY");
          item.end_date = moment(item.end_date).format("DD-MM-YYYY");
          item.cycle = props.cycle;
          item.performance_cycle = props.performance_cycle;
          item.is_activity = !!item.is_activity;
          item.objective_id = props.objective_id;
          if (isActivity[index] === undefined) {
            isActivity[index] = false;
          }

          if (!isActivity[index]) {
            item.activity_description = "";
            item.is_activity = false;
          } else {
            item.starting = 0;
            item.target = 0;
            item.is_activity = true;
          }

          if (newSubKRInputs[index]) {
            item.has_subkr = true;
            item.subkr = newSubKRInputs[index];
          }

          total += item.weightage;
          return item;
        });

        if (type === "awaiting_for_approval" && total !== 100) {
          message.error("For Approval, the weightage must be 100");
          return false;
        }

        if (!props.isEditPage) {
          message.loading("Saving...");
          let action: string =
            type === "awaiting_for_approval" ? "submit" : "save";
          HttpService.post("key-results", {
            items: newItems,
            action: action,
          })
            .then(() => {
              //history.push("/performance/my-okrs?reload=" + v4());
              window.location.reload();
            })
            .catch(() => {
              notification.error({
                message: "Error",
                description: "Error while saving key results",
              });
            })
            .finally(() => {
              message.destroy();
            });
        } else {
          props.items?.forEach((item: any, index: number) => {
            newItems[index].id = item.id;
          });
          message.loading("Saving...");

          HttpService.put("key-results", "bulk", { items: newItems })
            .then(() => {
              notification.success({
                message: "Success",
                description: "KR Updated Successfully",
              });
              window.location.reload();
              //history.push("/performance/my-okrs?reload=" + v4());
            })
            .catch(() => {})
            .finally(() => {
              message.destroy();
            });
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  const calculateWeightage = () => {
    let formData = form.getFieldsValue();
    const tempWeightage = Math.floor(100 / formData?.items?.length);
    let total: number = 0;
    formData?.items.forEach((item: any, index: number) => {
      if (index < formData?.items.length - 1) {
        item.weightage = tempWeightage;
        total += tempWeightage;
      }
      if (index === formData?.items.length - 1) {
        item.weightage = 100 - total;
      }
    });
    form.setFieldsValue(formData);
    CanSubmit();
  };

  const ValidateItems = () => {
    let hasValid = true;
    let values: any = form.getFieldsValue();
    values.items.map((item: any) => {
      if (moment(item.start_date).isAfter(moment(item.end_date))) {
        hasValid = false;
        return notification.error({
          description: "Please select the proper min/max dates",
          message: "Error",
        });
      }
      return item;
    });
    return hasValid;
  };

  return (
    <Fragment>
      <Drawer
        visible={SubKRVisible}
        title="Create Sub Key Result"
        width={1100}
        onClose={() => setSubKRVisible(false)}
        className=""
      >
        <SubKR
          {...SubKRData}
          onFinish={(index: any, value: any) => {
            const newSubKRInputs: any = { ...SubKRInputs };
            newSubKRInputs[index] = value;
            setSubKRInputs(newSubKRInputs);
            setSubKRVisible(false);
          }}
        />
      </Drawer>
      <Form
        name="dynamic_form_item"
        form={form}
        onFinish={() => onSubmit("open")}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <KRS key={field.key} className="kr-card">
                    <div>
                      <Obj className="card">
                        <Row gutter={3}>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, "description"]}
                              fieldKey={field.fieldKey}
                              rules={[
                                {
                                  required: true,
                                  message: " ",
                                },
                              ]}
                            >
                              <Input.TextArea
                                autoSize
                                placeholder="Description"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              name={[field.name, "start_date"]}
                              fieldKey={field.fieldKey}
                              rules={[{ required: true, message: " " }]}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                placeholder="From"
                                showToday={false}
                                format="DD-MMM-YYYY"
                                disabledDate={current => {
                                  return (
                                    current.isAfter(moment(props.end)) ||
                                    current.isBefore(moment(props.start))
                                  );
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              name={[field.name, "end_date"]}
                              fieldKey={field.fieldKey}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: " ",
                              //     validator: () => {
                              //       const fieldValue: any = form.getFieldsValue();
                              //       if (
                              //         moment(
                              //           fieldValue["items"][field.fieldKey]
                              //             .end_date,
                              //         ).isAfter(
                              //           fieldValue["items"][field.fieldKey]
                              //             .start_date,
                              //         )
                              //       ) {
                              //         return Promise.resolve();
                              //       } else {
                              //         message.error(
                              //           "Start Date is Greater than End Date",
                              //         );
                              //         return Promise.reject(
                              //           "Start Date is Greater than End Date",
                              //         );
                              //       }
                              //     },
                              //   },
                              // ]}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                placeholder="To"
                                showToday={false}
                                format="DD-MMM-YYYY"
                                disabledDate={current => {
                                  return (
                                    current.isAfter(moment(props.end)) ||
                                    current.isBefore(moment(props.start))
                                  );
                                }}
                              />
                            </Form.Item>
                          </Col>
                          {!props.isEditPage && (
                            <Col span={4}>
                              <Radio.Group
                                value="j"
                                size="middle"
                                onChange={e => {
                                  switch (e.target.value) {
                                    case "subkr":
                                      let value = form.getFieldsValue();
                                      value = value.items;
                                      value = value[field.fieldKey];
                                      if (!value.description) {
                                        return message.error(
                                          "Please enter a description of the KR",
                                        );
                                      }
                                      setSubKRData({
                                        start: value.start_date,
                                        end: value.end_date,
                                        description: value.description,
                                        objectiveType: props.objectiveType,
                                        index: field.fieldKey,
                                      });
                                      setSubKRVisible(true);

                                      break;
                                    case "delete":
                                      if (fields.length === 1) {
                                        message.error(
                                          "Error: Unable to delete the last row",
                                        );
                                        return false;
                                      } else {
                                        //remove(field.name);
                                        const tempIsActivity: any[] = [
                                          ...isActivity,
                                        ];
                                        let formData: any = form.getFieldsValue();

                                        tempIsActivity.splice(index, 1);
                                        formData.items.splice(index, 1);
                                        const tempWeightage = Math.floor(
                                          100 / formData?.items?.length,
                                        );

                                        const newSubKRInputs = {
                                          ...SubKRInputs,
                                        };
                                        if (newSubKRInputs[field.fieldKey]) {
                                          delete newSubKRInputs[field.fieldKey];
                                        }
                                        setSubKRInputs(newSubKRInputs);
                                        setIsActivity(tempIsActivity);
                                        form.setFieldsValue(formData);
                                        if (isWeightageChanged) {
                                          let total: number = 0;
                                          formData.items.forEach(
                                            (item: any, index: any) => {
                                              if (
                                                index <
                                                formData?.items.length - 1
                                              ) {
                                                item.weightage = tempWeightage;
                                                total += tempWeightage;
                                              }
                                              if (
                                                index ===
                                                formData?.items.length - 1
                                              ) {
                                                item.weightage = 100 - total;
                                              }
                                              return item;
                                            },
                                          );
                                        } else {
                                          CanSubmit();
                                        }
                                      }
                                      break;
                                    case "copy":
                                      form
                                        .validateFields()
                                        .then(() => {
                                          let formData: any = form.getFieldsValue();
                                          let newItem = {
                                            ...formData["items"][
                                              field.fieldKey
                                            ],
                                          };
                                          formData.items.push(newItem);
                                          const tempIsActivity: any[] = [
                                            ...isActivity,
                                          ];
                                          formData.items.forEach(
                                            (item: any, index: any) => {
                                              tempIsActivity[index] =
                                                item.is_activity ?? false;
                                            },
                                          );
                                          form.setFieldsValue(formData);
                                          setIsActivity(tempIsActivity);
                                          if (isWeightageChanged) {
                                            calculateWeightage();
                                          } else {
                                            CanSubmit();
                                          }
                                        })
                                        .catch(() => {});

                                      break;
                                    default:
                                      break;
                                  }
                                }}
                              >
                                <Radio.Button value="subkr">
                                  <Tooltip title="Create the sub KR">
                                    <ForkOutlined rotate={90} />
                                  </Tooltip>
                                </Radio.Button>
                                <Radio.Button value="copy">
                                  <Tooltip title="Copy the current row">
                                    <CopyOutlined />
                                  </Tooltip>
                                </Radio.Button>
                                <Radio.Button value="delete">
                                  <Tooltip title="Delete the row">
                                    <DeleteOutlined />
                                  </Tooltip>
                                </Radio.Button>
                              </Radio.Group>
                            </Col>
                          )}
                        </Row>
                        <Row gutter={3}>
                          <Col span={6}>
                            <Form.Item
                              name={[field.name, "user_id"]}
                              fieldKey={field.fieldKey}
                              rules={[{ required: true, message: " " }]}
                            >
                              <Select2
                                placeholder="Assign To"
                                entity={AssignToEndPoints}
                                entity_id="display_name"
                                style={{ width: "100%" }}
                                default={{
                                  name: props.user_name,
                                  value: props.user_id,
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Form.Item
                              name={[field.name, "weightage"]}
                              fieldKey={field.fieldKey}
                              rules={[
                                {
                                  required: true,
                                  message: " ",
                                },
                              ]}
                            >
                              <InputNumber
                                onChange={() => {
                                  CanSubmit();
                                  setIsWeightageChanged(false);
                                }}
                                placeholder="Weightage"
                                style={{ width: "100%" }}
                                // max={100}
                                // min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col
                            span={1}
                            style={{ paddingLeft: "0px", paddingRight: "0px" }}
                          >
                            <Form.Item
                              name={[field.name, "is_activity"]}
                              fieldKey={field.fieldKey}
                              valuePropName="checked"
                            >
                              <Switch
                                onChange={val => onSwtichChange(val, field)}
                              />
                            </Form.Item>
                          </Col>
                          {isActivity[field.fieldKey] && (
                            <Col span={6}>
                              <Form.Item
                                name={[field.name, "activity_description"]}
                                fieldKey={field.fieldKey}
                                rules={[
                                  {
                                    required: true,
                                    message: " ",
                                  },
                                ]}
                              >
                                <Input placeholder="Activity name" />
                              </Form.Item>
                            </Col>
                          )}
                          {!isActivity[field.fieldKey] && (
                            <>
                              <Col span={4}>
                                <Form.Item
                                  name={[field.name, "kpi"]}
                                  fieldKey={field.fieldKey}
                                >
                                  <Select2
                                    placeholder="KPI"
                                    entity="kpi"
                                    style={{ width: "100%" }}
                                    onSelect={(id: any, item: any) => {
                                      // let newItemsHelper: any = {
                                      //   ...ItemsHelpers,
                                      // };
                                      // newItemsHelper[
                                      //   field.fieldKey + "uom"
                                      // ] = true;
                                      let newFormValues: any = form.getFieldsValue();
                                      newFormValues.items[field.fieldKey][
                                        "uom"
                                      ] = item.item.uom;
                                      form.setFieldsValue(newFormValues);
                                      //setItemsHelpers(newItemsHelper);
                                      // const newUOMState: any = { ...UOMDisabled };
                                      // newUOMState[index] = true;
                                      // setUOMDisabled(newUOMState);
                                      // setItem(index, "uom", item.item.uom);
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={3}>
                                <Form.Item
                                  name={[field.name, "uom"]}
                                  fieldKey={field.fieldKey}
                                  rules={[
                                    {
                                      required: true,
                                      message: " ",
                                    },
                                  ]}
                                >
                                  <Select2
                                    placeholder="UoM"
                                    // disabled={
                                    //   ItemsHelpers[field.fieldKey + "uom"]
                                    // }
                                    entity="unit-of-measurements"
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Input.Group compact>
                                  <Form.Item
                                    name={[field.name, "boundaries"]}
                                    fieldKey={field.fieldKey}
                                    rules={[{ required: true, message: " " }]}
                                  >
                                    <Select
                                      placeholder="Boundaries"
                                      onChange={val => {
                                        let rules: any = [];
                                        let disabled: any = false;
                                        if (
                                          val === "through" ||
                                          val === "upto" ||
                                          val === "maximum"
                                        ) {
                                          rules = [
                                            { required: true, message: " " },
                                          ];
                                        }
                                        if (
                                          val === "through" ||
                                          val === "upto" ||
                                          val === "maximum"
                                        ) {
                                          disabled = true;
                                        } else {
                                          disabled = false;
                                        }
                                        if (!rules.length) {
                                          let formValues: any = form.getFieldsValue();
                                          formValues["items"][field.fieldKey][
                                            "starting"
                                          ] = null;
                                          form.setFieldsValue(formValues);
                                        }
                                        let tempHelper: any = { ...helper };
                                        tempHelper[
                                          "boundaries" + field.key
                                        ] = val;
                                        setHelper(tempHelper);
                                        //console.log(`helper: ${JSON.stringify(tempHelper)}`)
                                        // let newItemsHelper: any = {
                                        //   ...ItemsHelpers,
                                        // };
                                        // newItemsHelper[
                                        //   field.fieldKey + "rules"
                                        // ] = rules;
                                        // newItemsHelper[
                                        //   field.fieldKey + "disabled"
                                        // ] = disabled;
                                        // setItemsHelpers(newItemsHelper);
                                      }}
                                    >
                                      <Select.Option value="none">
                                        Progressive
                                      </Select.Option>
                                      <Select.Option value="minimum">
                                        Minimum
                                      </Select.Option>
                                      <Select.Option value="maximum">
                                        Maximum
                                      </Select.Option>
                                      <Select.Option value="through">
                                        Through
                                      </Select.Option>
                                      <Select.Option value="upto">
                                        Upto
                                      </Select.Option>
                                    </Select>
                                  </Form.Item>

                                  <Form.Item
                                    name={[field.name, "starting"]}
                                    fieldKey={field.fieldKey}
                                    rules={[
                                      {
                                        required:
                                          helper["boundaries" + field.key] ===
                                          "maximum"
                                            ? true
                                            : false,
                                        message:
                                          helper["boundaries" + field.key] ===
                                          "maximum"
                                            ? "required"
                                            : "",
                                      },
                                    ]}
                                  >
                                    <Input
                                      style={{ width: "6rem" }}
                                      type="number"
                                      step=".01"
                                      // disabled={
                                      //   !ItemsHelpers[
                                      //     field.fieldKey + "disabled"
                                      //   ]
                                      //     ? true
                                      //     : false
                                      // }
                                      onChange={e => {
                                        let val: any = e.target.value;
                                        val = parseFloat(val);
                                        val = parseFloat(val.toFixed(4));
                                        // let newItemsHelper: any = {
                                        //   ...ItemsHelpers,
                                        // };
                                        // newItemsHelper[
                                        //   field.fieldKey + "starting"
                                        // ] = val;
                                        // setItemsHelpers(newItemsHelper);
                                      }}
                                      placeholder="Starting"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name={[field.name, "target"]}
                                    fieldKey={field.fieldKey}
                                    rules={[{ required: true, message: " " }]}
                                  >
                                    <Input
                                      style={{ width: "5rem" }}
                                      placeholder="Target"
                                      onChange={e => {
                                        let val: any = e.target.value;
                                        val = parseFloat(val);
                                        val = parseFloat(val.toFixed(4));
                                        // let newItemsHelper: any = {
                                        //   ...ItemsHelpers,
                                        // };
                                        // newItemsHelper[
                                        //   field.fieldKey + "target"
                                        // ] = val;
                                        // setItemsHelpers(newItemsHelper);
                                      }}
                                    />
                                  </Form.Item>
                                </Input.Group>
                              </Col>
                            </>
                          )}
                        </Row>
                      </Obj>
                    </div>
                  </KRS>
                ))}
                <Form.Item>
                  <Btn
                    type="button"
                    disabled={props.isEditPage}
                    onClick={() => {
                      if (ValidateItems()) {
                        form
                          .validateFields()
                          .then(e => {
                            add();
                            const formData = form.getFieldsValue();
                            const tempIsActivity: any[] = [...isActivity];
                            formData.items[formData.items.length - 1].user_id =
                              props.user_id;
                            formData.items[
                              formData.items.length - 1
                            ].boundaries = "none";
                            formData.items[
                              formData.items.length - 1
                            ].start_date = moment(props.start);
                            formData.items[
                              formData.items.length - 1
                            ].end_date = moment(props.end);
                            tempIsActivity[formData.items.length - 1] = false;
                            form.setFieldsValue(formData);
                            calculateWeightage();
                          })
                          .catch(e => {});
                      }
                    }}
                  >
                    <PlusCircleFilled /> New
                  </Btn>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Form>

      <Footer1>
        <Checkbox
          style={{ float: "none" }}
          checked={isWeightageChanged}
          onChange={(e: any) => {
            if (e.target.checked) {
              calculateWeightage();
              setIsWeightageChanged(true);
            } else {
              setIsWeightageChanged(false);
            }
          }}
        >
          Assign equal weightage
        </Checkbox>
      </Footer1>
      <Footer>
        <Button type="primary" onClick={() => onSubmit("open")}>
          Save & Close
        </Button>
        <Button
          type="primary"
          onClick={() => onSubmit("awaiting_for_approval")}
        >
          Submit for Approval
        </Button>
      </Footer>
    </Fragment>
  );
};

KeyResults.defaultProps = {
  items: [],
  isEditPage: false,
} as Partial<KeyResults>;

export default KeyResults;
