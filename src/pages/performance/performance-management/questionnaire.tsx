import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  notification,
} from "antd";
import { useSelector } from "react-redux";

import HttpService from "../../../services/httpService";
import SKLoader from "../../../components/skloader";
import Utils from "../../../utils";

const { xs, md } = Utils.MediaQuery;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
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

const WrapperCard = styled(Card)`
  //border: 1px solid #1864ab;
  width: 60%;
  margin: 0rem 10rem;
  border: 0px;
  ${xs} {
    width: 100%;
    margin: 0rem;
  }
`;

const { Item } = Form;

const Questionnaire = (props: any) => {
  const [form] = Form.useForm();
  const state = useSelector((store: any) => store.INITIAL_DATA);
  const filter = useSelector((state: any) => state.FILTERS);
  const [Loading, setLoading] = useState<boolean>(true);
  const [prSettings, setPrSettings] = useState<any>(undefined);
  const [appCycle, setAppCycles] = useState<any>([]);
  const [CurrentTimeline, setCurrentTimeline] = useState<any>("");
  const [selectedCycle, setSelectedCycle] = useState<any>(undefined);
  const [reviewCycle, setReviewCycle] = useState<any>(undefined);
  const Questions = state?.prSettings?.questions ?? undefined;
  const Choice = state?.prSettings?.define_choices ?? undefined;
  const Rating = state?.prSettings?.define_ratings ?? undefined;
  const [questionData, setQuestionData] = useState<any>(undefined);
  const [prData, setPrData] = useState<any>(undefined);
  const [answers, setAnswers] = useState<any>([]);
  const [questionStatus, setQuestonStatus] = useState<any>(false);

  useEffect(() => {
    if (state && state.app_settings && state.app_settings.settings.cycles) {
      setAppCycles(state.app_settings.settings.cycles);
    }
    setPrSettings(state?.prSettings ?? undefined);
    setCurrentTimeline(filter.performance_cycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    console.log(`appCycle: ${JSON.stringify(appCycle)}`);
    let selectedCycle: any = undefined;
    appCycle.forEach((item: any) => {
      if (item.name === CurrentTimeline) {
        selectedCycle = item;
      }
    });
    setSelectedCycle(selectedCycle);
    console.log(`selectedCycle: ${JSON.stringify(selectedCycle)}`);
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

  const getMyData = () => {
    reviewCycle &&
      HttpService.get(
        "performance/my-view",
        {},
        {
          review_cycle: reviewCycle,
        },
      )
        .then(res => {
          setPrData(res ?? undefined);
          setLoading(false);
          //console.log(`res: ${JSON.stringify(res)}`)
        })
        .catch(err => {});
  };

  useEffect(() => {
    getMyData();
  }, [reviewCycle]);

  useEffect(() => {
    if (prData?.answers?.length) {
      if (prData?.answers[0]["status"] === "submitted") {
        setQuestonStatus(true);
      } else {
        setQuestonStatus(false);
      }
    }
  }, [prData]);

  useEffect(() => {
    let tempAnswers: any = [];
    if (Questions) {
      Questions?.map((item: any) => {
        tempAnswers.push({
          id: undefined,
          question_id: item.id,
          question: item.question,
          answerType: item.answerType,
          answer_choice: undefined,
          answer_rating: undefined,
          answer_text: undefined,
          tenant_id: item.tenant_id,
          prs_id: item.prs_id,
          user_id: state?.user?.id,
          status: "draft",
        });
      });
    }
    //console.log(`questions: ${JSON.stringify(tempAnswers)}`);
    setQuestionData(tempAnswers);
  }, [Questions, prData]);

  useEffect(() => {
    if (questionData?.length) {
      let QuestionData: any = [...questionData];
      let tempAnswers: any = [...questionData];
      if (prData?.answers?.length) {
        prData?.answers?.map((item: any) => {
          QuestionData?.map((item1: any, index: number) => {
            if (item?.question_id === item1?.question_id) {
              tempAnswers[index]["id"] = item?.id ?? undefined;
              tempAnswers[index]["question_id"] =
                item?.question_id ?? undefined;
              tempAnswers[index]["answer_choice"] =
                item?.answer_choice ?? undefined;
              tempAnswers[index]["answer_rating"] =
                item?.answer_rating ?? undefined;
              tempAnswers[index]["answer_text"] =
                item?.answer_text ?? undefined;
              tempAnswers[index]["status"] = item?.status ?? undefined;
            }
          });
        });
        //console.log(`ans: ${JSON.stringify(tempAnswers)}`);
      }
      setAnswers(tempAnswers);
    }
  }, [questionData, prData]);

  const getAnswer = (item: any) => {
    let answer: any = undefined;
    if (item.answerType === "text") {
      answer = item.answer_text;
    }
    if (item.answerType === "choice") {
      answer = item.answer_choice;
    }
    if (item.answerType === "rating") {
      answer = item.answer_rating;
    }
    return answer;
  };

  const onAnswerChange = (value: any, type: any, item: any) => {
    let tempAnswers: any = [...answers];
    tempAnswers?.map((item1: any) => {
      if (item1.question_id === item.question_id) {
        if (type === "rating") {
          item1["answer_rating"] = value;
        }
        if (type === "choice") {
          item1["answer_choice"] = value;
        }
        if (type === "text") {
          item1["answer_text"] = value;
        }
      }
    });
    console.log(`questions: ${JSON.stringify(tempAnswers)}`);
    setAnswers(tempAnswers);
  };

  const onAnswerSubmit = (type: string) => {
    let value: any = [...answers];
    value?.forEach((item: any) => {
      item.status = type ?? "draft";
      delete item.question;
    });
    console.log(`questions: ${JSON.stringify(value)}`);
    if (state?.user?.id) {
      HttpService.put("performance/answers", state?.user?.id, value)
        .then(res => {
          props.setQuestionDrawerVisible(false);
          props.getData();
        })
        .catch(() => {
          notification.error({
            description: "Something went wrong",
            message: "Error",
          });
        });
    }
  };

  return (
    <Wrapper>
      {Loading && <SKLoader />}
      {!Loading && (
        <WrapperCard>
          <Row justify={"space-around"}>
            <Col span={20} style={{ textAlign: "center" }}>
              <h2>
                <b>Questionnaire</b>
              </h2>
            </Col>
          </Row>
          <Row justify={"space-around"}>
            <Col span={20}>
              <Form
                {...layout}
                layout="vertical"
                // onFinish={value => onSubmit(value)}
                form={form}
                colon={false}
              >
                {answers &&
                  answers.map((item: any) => (
                    <Item
                      style={{ marginTop: "1rem" }}
                      //name={item.question}
                      label={item.question}
                    >
                      {item.answerType === "text" && (
                        <Input
                          disabled={item.status === "submitted" ? true : false}
                          value={getAnswer(item)}
                          onChange={e => {
                            onAnswerChange(e?.target?.value, "text", item);
                          }}
                        />
                      )}
                      {item.answerType === "rating" && (
                        <Select
                          disabled={item.status === "submitted" ? true : false}
                          value={getAnswer(item)}
                          onChange={e => {
                            onAnswerChange(e, "rating", item);
                          }}
                        >
                          {Rating &&
                            Rating.map((item: any) => (
                              <Select.Option key={item.id} value={item.id}>
                                {item.rating_name}
                              </Select.Option>
                            ))}
                        </Select>
                      )}
                      {item.answerType === "choice" && (
                        <Select
                          disabled={item.status === "submitted" ? true : false}
                          value={getAnswer(item)}
                          onChange={e => {
                            onAnswerChange(e, "choice", item);
                          }}
                        >
                          {Choice &&
                            Choice.map((item: any) => (
                              <Select.Option key={item.id} value={item.id}>
                                {item.choice_name}
                              </Select.Option>
                            ))}
                        </Select>
                      )}
                    </Item>
                  ))}
                <Item label=" " style={{ marginTop: "2rem" }}>
                  <Button
                    style={{ float: "right", margin: "3px" }}
                    type="primary"
                    htmlType="submit"
                    disabled={questionStatus ? true : false}
                    onClick={() => onAnswerSubmit("submitted")}
                  >
                    Submit
                  </Button>
                  <Button
                    style={{ float: "right", margin: "3px" }}
                    type="primary"
                    htmlType="submit"
                    disabled={questionStatus ? true : false}
                    onClick={() => onAnswerSubmit("draft")}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    style={{ float: "right", margin: "3px" }}
                    htmlType="button"
                    onClick={() => {
                      props.setQuestionDrawerVisible(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Item>
              </Form>
            </Col>
          </Row>
        </WrapperCard>
      )}
    </Wrapper>
  );
};

export default Questionnaire;
