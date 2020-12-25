import styled from "styled-components";
import React, { memo, useEffect, useState } from "react";
import { Badge, Button, Col, Row } from "antd";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import HttpService from "../../../services/httpService";
import KRAprove from "./kr-approve";
import MyTeam from "../my-team";
import ObjectiveClosure from "./obj-closure";
import ObjectiveNew from "./obj-new";
import ObjectiveWeightage from "./obj-weightage";
import SKLoader from "../../../components/skloader";

interface approvalCount {
  kr_approval: string;
  obj_closure: string;
  new_obj_approval: string;
  obj_weightage_approval: string;
}
const Wrapper = styled.div`
  //border: 1px solid black;
  max-height: 68vh;
  overflow: auto;
  width: 100%;
  h3 a {
    color: #000;
  }
`;
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
  width: 100%;
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

const Divider = styled.div`
  border-bottom: 3px solid #fff;
  position: relative;
  top: -7px;
`;
const ButtonGroup = styled.div`
  padding: 5px;
  margin-bottom: 3px;
  padding-bottom: 1px;
  .ant-btn {
    box-shadow: none;
    background: transparent;
    border: 1px solid transparent;
    font-weight: normal;
    margin: 0 5px;
    border-radius: 0;
    color: #000;
    &:hover {
      color: #000;
    }
  }
  .ant-badge {
    margin-left: 4px;
    .ant-badge-count {
      background-color: #fff;
      color: #000;
      box-shadow: 0 0 0 1px #d9d9d9 inset;
      margin-top: -4px;
    }
  }
  .ant-btn-primary {
    border-bottom: 3px solid #18384d;
    z-index: 1;
  }
`;

interface Props {
  pageName?: string;
}

const tokens: any = {
  kr: v4(),
  "obj-close": v4(),
  "obj-new": v4(),
  "obj-weightage": v4(),
};
const Approve = (props: Props) => {
  const [ActivePage, setActivePage] = useState("kr");
  const [IsLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [CurrentCycle, setCurrentCycle] = useState();
  const [CurrentTimeline, setCurrentTimeline] = useState("");
  const [ApprovalCount, setApprovalCount] = useState({
    kr_approval: "0",
    obj_closure: "0",
    new_obj_approval: "0",
    obj_weightage_approval: "0",
  });
  const filter = useSelector((state: any) => state.FILTERS);
  const [openOkrListPage, setOpenOkrListPage] = useState(false);

  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    setCurrentTimeline(filter.performance_cycle);
  }, [CurrentTimeline, state]);

  useEffect(() => {
    let currenttab = location.pathname
      .replace("/performance/approvals", "")
      .replace(/\/$/, "");
    currenttab = currenttab.replace("/", "");

    if (CurrentCycle) {
      HttpService.get(
        "others/approval",
        {},
        {
          cycle: CurrentCycle,
        },
      ).then((res: approvalCount) => {
        setIsLoaded(true);
        setApprovalCount(res);
      });
    }

    setActivePage(currenttab || "kr");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentCycle]);

  useEffect(() => {
    tokens[ActivePage] = v4();
  }, [ActivePage]);

  return (
    <>
      {!props.pageName && (
        <div>
          {!IsLoaded && (
            <>
              <SKLoader count={6} />
            </>
          )}
          {IsLoaded && (
            <>
              <ButtonGroup>
                <Button
                  type={ActivePage === "kr" ? "primary" : "default"}
                  onClick={() => setActivePage("kr")}
                >
                  Checkin Approval
                  <Badge count={parseInt(ApprovalCount.kr_approval) || 0} />
                </Button>
                <Button
                  type={ActivePage === "obj-close" ? "primary" : "default"}
                  onClick={() => setActivePage("obj-close")}
                >
                  Obj Closure
                  <Badge count={parseInt(ApprovalCount.obj_closure) || 0} />
                </Button>
                <Button
                  type={ActivePage === "obj-new" ? "primary" : "default"}
                  onClick={() => setActivePage("obj-new")}
                >
                  New Obj Approval
                  <Badge
                    count={parseInt(ApprovalCount.new_obj_approval) || 0}
                  />
                </Button>
                {/* <Button
              type={ActivePage === "obj-weightage" ? "primary" : "default"}
              onClick={() => setActivePage("obj-weightage")}
            >
              Obj Weightage Approval
              <Badge
                count={parseInt(ApprovalCount.obj_weightage_approval) || 0}
              />
            </Button> */}
              </ButtonGroup>
              <Divider />
              {ActivePage === "kr" && <KRAprove key={tokens.kr} />}
              {ActivePage === "obj-close" && (
                <ObjectiveClosure
                  key={tokens["obj-close"]}
                  onChange={() => {
                    let count: any = { ...ApprovalCount };
                    count.obj_closure = parseInt(count.obj_closure, 10) - 1;
                    if (count.obj_closure < 0) {
                      count.obj_closure = 0;
                    }
                    setApprovalCount(count);
                  }}
                />
              )}
              {ActivePage === "obj-new" && (
                <ObjectiveNew
                  onChange={() => {
                    let count: any = { ...ApprovalCount };
                    count.new_obj_approval =
                      parseInt(count.new_obj_approval, 10) - 1;
                    if (count.new_obj_approval < 0) {
                      count.new_obj_approval = 0;
                    }
                    setApprovalCount(count);
                  }}
                  key={tokens["obj-new"]}
                />
              )}
              {ActivePage === "obj-weightage" && (
                <ObjectiveWeightage key={tokens["obj-weightage"]} />
              )}
            </>
          )}
        </div>
      )}
      {props.pageName && !openOkrListPage && (
        <Wrapper>
          <TopDiv>
            <Row>
              <Col span={2} style={{ textAlign: "center", paddingTop: "5px" }}>
                <strong>{CurrentTimeline}</strong>
              </Col>
              <Col span={20}></Col>
              {/* <Col span={20} style={{ paddingTop: "5px" }}>
                Overall Performance
                &nbsp;
                <strong>{Utils.round(overallPerformance + "")}</strong>
              </Col> */}
              <Col span={2}>
                <TopButton onClick={() => setOpenOkrListPage(true)}>
                  OKR
                </TopButton>
              </Col>
            </Row>
          </TopDiv>
          {props.pageName === "kr" && <KRAprove key={tokens.kr} />}
          {props.pageName === "obj-close" && (
            <ObjectiveClosure
              key={tokens["obj-close"]}
              onChange={() => {
                let count: any = { ...ApprovalCount };
                count.obj_closure = parseInt(count.obj_closure, 10) - 1;
                if (count.obj_closure < 0) {
                  count.obj_closure = 0;
                }
                setApprovalCount(count);
              }}
            />
          )}
          {props.pageName === "obj-new" && (
            <ObjectiveNew
              onChange={() => {
                let count: any = { ...ApprovalCount };
                count.new_obj_approval =
                  parseInt(count.new_obj_approval, 10) - 1;
                if (count.new_obj_approval < 0) {
                  count.new_obj_approval = 0;
                }
                setApprovalCount(count);
              }}
              key={tokens["obj-new"]}
            />
          )}
        </Wrapper>
      )}
      {openOkrListPage && <MyTeam />}
    </>
  );
};

export default Approve;
