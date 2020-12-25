import moment from "moment";
import styled from "styled-components";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
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
import { useSelector } from "react-redux";

import Select2 from "../../../../components/select2";

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

const Footer = styled.div`
  position: absolute;
  z-index: 12;
  right: 7px;
  bottom: 10px;
  .ant-btn {
    margin-left: 12px;
  }
`;

interface SubKR {
  index: number;
  start: string;
  end: string;
  objectiveType: string;
  description: string;
  onFinish: Function;
}

const SubKR: React.FC<SubKR> = props => {
  const [form] = Form.useForm();
  const [ItemsHelpers, setItemsHelpers]: [any, Function] = useState({});
  // const [InitialValue, setInitialValue] = useState([]);
  const [AssignToEndPoints, setAssignToEndPoints] = useState("users");
  const state = useSelector((state: any) => state.INITIAL_DATA);

  useEffect(() => {
    if (state?.app_settings?.settings?.assign !== "private") {
      setAssignToEndPoints("users");
    } else {
      if (
        props.objectiveType === "team" ||
        props.objectiveType === "organization"
      ) {
        setAssignToEndPoints("users/direct-reportees");
      } else if (props.objectiveType === "cross_team") {
        setAssignToEndPoints("users/secondary-reportees");
      }
    }
  }, [props.objectiveType, state]);

  useEffect(() => {
    let initialValues = {
      user_id: state?.user?.id,
      boundaries: "none",
    };
    form.setFieldsValue({
      items: [initialValues],
    });
  }, [form, state]);

  const onSwtichChange = (value: any, field: any) => {
    const newItemsHelper: any = { ...ItemsHelpers };
    if (newItemsHelper[field.fieldKey] === undefined) {
      newItemsHelper[field.fieldKey] = false;
    }
    newItemsHelper[field.fieldKey] = !newItemsHelper[field.fieldKey];
    setItemsHelpers(newItemsHelper);
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then(() => {
        const val = form.getFieldsValue();
        const newItemsHelper: any = { ...ItemsHelpers };
        let total: number = 0;
        const newItems: any = val.items.map((item: any, index: number) => {
          item.start_date = moment(item.start_date).format("DD-MM-YYYY");
          item.end_date = moment(item.end_date).format("DD-MM-YYYY");
          item.is_activity = !!item.activity;
          if (!newItemsHelper[index]) {
            item.activity_description = "";
            item.is_activity = false;
          } else {
            item.starting = 0;
            item.target = 0;
            item.is_activity = true;
          }
          total += item.weightage;
          return item;
        });
        if (total !== 100) {
          message.error(" The total weightage must be 100");
          return false;
        }
        props.onFinish(props.index, newItems);
      })
      .catch(e => {
        console.error(e);
      });
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
      <Obj>{props.description}</Obj>
      <Form name="dynamic_form_item" form={form} onFinish={() => onSubmit()}>
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
                            <Tooltip title="Description">
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
                            </Tooltip>
                          </Col>
                          <Col span={4}>
                            <Tooltip title="Start Date">
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
                                      current.isAfter(
                                        moment(props.end).add("day", "1"),
                                      ) || current.isBefore(moment(props.start))
                                    );
                                  }}
                                />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          <Col span={4}>
                            <Tooltip title="End Date">
                              <Form.Item
                                name={[field.name, "end_date"]}
                                fieldKey={field.fieldKey}
                                rules={[
                                  {
                                    required: true,
                                    message: " ",
                                    validator: () => {
                                      const fieldValue: any = form.getFieldsValue();
                                      if (
                                        moment(
                                          fieldValue["items"][field.fieldKey]
                                            .end_date,
                                        ).isAfter(
                                          fieldValue["items"][field.fieldKey]
                                            .start_date,
                                        )
                                      ) {
                                        return Promise.resolve();
                                      } else {
                                        message.error(
                                          "Start Date is Greater than End Date",
                                        );
                                        return Promise.reject(
                                          "Start Date is Greater than End Date",
                                        );
                                      }
                                    },
                                  },
                                ]}
                              >
                                <DatePicker
                                  style={{ width: "100%" }}
                                  placeholder="To"
                                  showToday={false}
                                  format="DD-MMM-YYYY"
                                  disabledDate={current => {
                                    return (
                                      current.isAfter(
                                        moment(props.end).add("day", "1"),
                                      ) || current.isBefore(moment(props.start))
                                    );
                                  }}
                                />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          <Col span={4}>
                            <Radio.Group
                              value="j"
                              size="middle"
                              onChange={e => {
                                switch (e.target.value) {
                                  case "delete":
                                    if (fields.length === 1) {
                                      message.error(
                                        "Error: Unable to delete the last row",
                                      );
                                      return false;
                                    } else {
                                      remove(field.name);
                                    }
                                    break;
                                  case "copy":
                                    form
                                      .validateFields()
                                      .then(() => {
                                        let formData: any = form.getFieldsValue();
                                        let newItem = {
                                          ...formData["items"][field.fieldKey],
                                        };
                                        formData.items.push(newItem);
                                        form.setFieldsValue(formData);
                                      })
                                      .catch(() => {});

                                    break;
                                  default:
                                    break;
                                }
                              }}
                            >
                              <Radio.Button disabled value="sub-kr">
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
                        </Row>
                        <Row gutter={3}>
                          <Col span={6}>
                            <Tooltip title="Assign To">
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
                                    name: state?.user?.display_name,
                                    value: state?.user?.id,
                                  }}
                                />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          <Col span={2}>
                            <Tooltip title="Weightage">
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
                                  placeholder="Weightage"
                                  style={{ width: "100%" }}
                                  max={100}
                                  min={0}
                                />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          <Col span={2}>
                            <Tooltip title="Activity">
                              <Form.Item
                                name={[field.name, "is_activity"]}
                                fieldKey={field.fieldKey}
                                valuePropName="checked"
                              >
                                <Switch
                                  onChange={val => onSwtichChange(val, field)}
                                />
                              </Form.Item>
                            </Tooltip>
                          </Col>
                          {ItemsHelpers[field.fieldKey] && (
                            <Col span={6}>
                              <Tooltip title="Activity name">
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
                              </Tooltip>
                            </Col>
                          )}
                          {!ItemsHelpers[field.fieldKey] && (
                            <>
                              <Col span={4}>
                                <Tooltip title="KPI">
                                  <Form.Item
                                    name={[field.name, "kpi"]}
                                    fieldKey={field.fieldKey}
                                  >
                                    <Select2
                                      placeholder="KPI"
                                      entity="kpi"
                                      style={{ width: "100%" }}
                                      onSelect={(id: any, item: any) => {
                                        let newItemsHelper: any = {
                                          ...ItemsHelpers,
                                        };
                                        newItemsHelper[
                                          field.fieldKey + "uom"
                                        ] = true;
                                        let newFormValues: any = form.getFieldsValue();
                                        newFormValues.items[field.fieldKey][
                                          "uom"
                                        ] = item.item.uom;
                                        form.setFieldsValue(newFormValues);
                                        setItemsHelpers(newItemsHelper);
                                        // const newUOMState: any = { ...UOMDisabled };
                                        // newUOMState[index] = true;
                                        // setUOMDisabled(newUOMState);
                                        // setItem(index, "uom", item.item.uom);
                                      }}
                                    />
                                  </Form.Item>
                                </Tooltip>
                              </Col>
                              <Col span={3}>
                                <Tooltip title="Unit of Measurements">
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
                                      disabled={
                                        ItemsHelpers[field.fieldKey + "uom"]
                                      }
                                      entity="unit-of-measurements"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Tooltip>
                              </Col>
                              <Col span={7}>
                                <Input.Group compact>
                                  <Form.Item
                                    name={[field.name, "boundaries"]}
                                    fieldKey={field.fieldKey}
                                    rules={[{ required: true, message: " " }]}
                                  >
                                    <Select
                                      style={{ width: "108px" }}
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
                                        let newItemsHelper: any = {
                                          ...ItemsHelpers,
                                        };
                                        newItemsHelper[
                                          field.fieldKey + "rules"
                                        ] = rules;
                                        newItemsHelper[
                                          field.fieldKey + "disabled"
                                        ] = disabled;
                                        setItemsHelpers(newItemsHelper);
                                      }}
                                    >
                                      <Select.Option value="none">
                                        &nbsp;
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

                                  <Tooltip
                                    title={
                                      ItemsHelpers[field.fieldKey + "starting"]
                                        ? parseFloat(
                                            ItemsHelpers[
                                              field.fieldKey + "starting"
                                            ],
                                          ).toLocaleString()
                                        : "Starting"
                                    }
                                  >
                                    <Form.Item
                                      name={[field.name, "starting"]}
                                      fieldKey={field.fieldKey}
                                      rules={
                                        ItemsHelpers[field.fieldKey + "rules"]
                                          ? ItemsHelpers[
                                              field.fieldKey + "rules"
                                            ]
                                          : []
                                      }
                                    >
                                      <Input
                                        style={{ width: 75 }}
                                        type="number"
                                        step=".01"
                                        disabled={
                                          !ItemsHelpers[
                                            field.fieldKey + "disabled"
                                          ]
                                            ? true
                                            : false
                                        }
                                        onChange={e => {
                                          let val: any = e.target.value;
                                          val = parseFloat(val);
                                          val = parseFloat(val.toFixed(4));
                                          let newItemsHelper: any = {
                                            ...ItemsHelpers,
                                          };
                                          newItemsHelper[
                                            field.fieldKey + "starting"
                                          ] = val;
                                          setItemsHelpers(newItemsHelper);
                                        }}
                                        placeholder="Starting"
                                      />
                                    </Form.Item>
                                  </Tooltip>

                                  <Tooltip
                                    title={
                                      ItemsHelpers[field.fieldKey + "target"]
                                        ? parseFloat(
                                            ItemsHelpers[
                                              field.fieldKey + "target"
                                            ],
                                          ).toLocaleString()
                                        : "Target"
                                    }
                                  >
                                    <Form.Item
                                      name={[field.name, "target"]}
                                      fieldKey={field.fieldKey}
                                      rules={[{ required: true, message: " " }]}
                                    >
                                      <Input
                                        style={{ width: 75 }}
                                        placeholder="Target"
                                        onChange={e => {
                                          let val: any = e.target.value;
                                          val = parseFloat(val);
                                          val = parseFloat(val.toFixed(4));
                                          let newItemsHelper: any = {
                                            ...ItemsHelpers,
                                          };
                                          newItemsHelper[
                                            field.fieldKey + "target"
                                          ] = val;
                                          setItemsHelpers(newItemsHelper);
                                        }}
                                      />
                                    </Form.Item>
                                  </Tooltip>
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
                    onClick={() => {
                      if (ValidateItems()) {
                        form
                          .validateFields()
                          .then(e => {
                            add();
                            const formData = form.getFieldsValue();
                            formData.items[formData.items.length - 1].user_id =
                              state?.user?.id;
                            formData.items[
                              formData.items.length - 1
                            ].boundaries = "none";

                            form.setFieldsValue(formData);
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
      <Footer>
        <Button type="primary" onClick={() => onSubmit()}>
          Add Sub KR
        </Button>
      </Footer>
    </Fragment>
  );
};

SubKR.defaultProps = {
  items: [],
  isEditPage: false,
} as Partial<SubKR>;

export default SubKR;
