import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Divider, Steps, message, notification } from "antd";
import { WindowsFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import FormFooter from "../../../../components/form-footer";
import HttpService from "../../../../services/httpService";
import KeyResults from "./key-results";
import Objective from "./objective";
import PerformanceCycle from "./performance-cycle";
import { default as ObjType } from "./objective-type";

const { Step } = Steps;

const Wrapper = styled.div`
  .ant-steps-horizontal:not(.ant-steps-label-vertical)
    .ant-steps-item-description {
    max-width: initial;
  }
`;

interface OkrModifier {
  refreshToken: string;
  // isDuplicate: boolean;
  objectiveItem?: any;
  isAdmin?: boolean;
}

const OkrModifier: React.FC<OkrModifier> = props => {
  const history = useHistory();
  const [profile, setProfile] = useState("");
  const [NameFirstLetter, setNameFirstLetter] = useState("");
  const [ObjectiveTypeState, setObjectiveTypeState] = useState({
    goal_id: "",
    type: "",
  });
  const [NextDisbale, setNextDisbale] = useState(true);
  const [activeStep, setActiveSteps] = useState(0);
  const [cycle_start_date, setCycleStartDate] = useState("");
  const [cycle_end_date, setCycleEndDate] = useState("");
  const [ObjStepDescription, setObjStepDescription] = useState("");
  const [obj_start_date, setobjStartDate] = useState("");
  const [obj_end_date, setobjEndDate] = useState("");
  const [ObjectiveID, setObjectiveID] = useState("");
  const [description, setDescription] = useState("");
  const [PerfCycleName, setPerfCycleName] = useState("");
  const [ObjectiveType, setObjectiveType] = useState("");
  const [Cycle, setCycle] = useState("");
  const [krForDuplicate, setKrForDuplicate] = useState<any | undefined>([]);
  const [isAdmin, setisAdmin] = useState(false);
  const state = useSelector((state: any) => state.INITIAL_DATA);
  useEffect(() => {
    setNameFirstLetter(state?.user?.display_name?.charAt(0));
    setisAdmin(
      state?.roles.name === "Org Admin" ||
        state?.roles.name === "Product Admin",
    );
  }, [state]);

  useEffect(() => {
    console.log(`profile in useEffect: ${JSON.stringify(props.isAdmin)}`);
    if (props?.objectiveItem?.id) {
      HttpService.get(
        "key-results/objective/" + props.objectiveItem.id,
        {},
        {
          is_admin: isAdmin,
        },
      )
        .then(res => {
          setKrForDuplicate(res);
        })
        .catch(() => {});
    } else {
      setKrForDuplicate(undefined);
    }
  }, [props.objectiveItem]);

  useEffect(() => {
    if (props?.objectiveItem?.id && krForDuplicate) {
      setActiveSteps(0);
      setPerfCycleName(props.objectiveItem?.performance_cycle ?? "");
      setObjectiveType(props.objectiveItem?.objective_type ?? "");
      setObjStepDescription(props.objectiveItem?.description ?? "");
    } else {
      setActiveSteps(0);
      setPerfCycleName("");
      setObjectiveType("");
      setObjStepDescription("");
    }
  }, [props, krForDuplicate]);

  /**
   *  Steps Change
   */
  /**
   * ****************************************************************
   * Step 1
   */
  const onCycleSelect = (val: any, index: number) => {
    setPerfCycleName(val.name);
    setCycleStartDate(val.start);
    setCycleEndDate(val.end);
    setProfile(state.user.profile_photo);
    setCycle(val.cycle);
    onNextStep();
  };

  /**
   * ****************************************************************
   * Step 2
   */
  const onObjectiveTypeSelect = (val: any) => {
    setObjectiveTypeState(val);
    if (val.type === "goal" && val.goal_id) {
      setNextDisbale(false);
    } else if (val.type) {
      setNextDisbale(false);
    } else {
      setNextDisbale(true);
    }
    let SecondStepTitle = "";
    switch (val.type) {
      case "own":
        SecondStepTitle = "My Own Objective";
        break;
      case "team":
        SecondStepTitle = "Team Objective";
        break;
      case "cross_team":
        SecondStepTitle = "Cross Functional Team Objective";
        break;
      case "org":
        SecondStepTitle = "Organization Objective";
        break;
    }
    setObjectiveType(SecondStepTitle);
  };

  const onNextStep = () => {
    setActiveSteps(activeStep + 1);
  };

  const onObjectiveSave = (formData: any, action: string) => {
    if (!Array.isArray(formData.assign_to)) {
      formData.assign_to = [formData.assign_to];
    }

    const data = {
      description: formData.objective_description,
      performance_cycle: PerfCycleName,
      objective_type: ObjectiveTypeState.type,
      user_id: formData.assign_to,
      category: formData.category,
      is_shared: formData.shared,
      start_date: moment(formData.from).format(),
      end_date: moment(formData.to).format(),
      measureable: formData.measurable,
      target: formData.target?.toString(),
      uom: formData.uom || null,
      status: "yet_to_submit",
      goal_id: ObjectiveTypeState.goal_id || null,
      cycle: Cycle,
    };
    setobjStartDate(formData.from);
    setobjEndDate(formData.to);
    setObjStepDescription(
      moment(formData.from).format("DD-MMM-YYYY") +
        " to " +
        moment(formData.to).format("DD-MMM-YYYY"),
    );
    const from = moment(formData.from).format("DD-MMM-YYYY");
    const to = moment(formData.to).format("DD-MMM-YYYY");
    const fromDate = moment(from).isBetween(
      cycle_start_date,
      cycle_end_date,
      undefined,
      "[]",
    );
    const endDate = moment(to).isBetween(
      cycle_start_date,
      cycle_end_date,
      undefined,
      "[]",
    );

    if (fromDate && endDate) {
      setDescription(formData.objective_description);
      message.loading("Saving...");
      if (!formData.hasOwnProperty("shared")) {
        data.is_shared =
          data.objective_type === "cft" || data.objective_type === "team"
            ? true
            : false;
      }
      HttpService.post("objectives", data)
        .then(res => {
          if (!res.data) {
            action = "save";
          }
          setObjectiveID(res.data);
          if (action === "save") {
            //history.push("/performance/my-okrs?reload=" + v4());
            window.location.reload();
            notification.success({
              message: "Success",
              description: "Objective added successfully",
            });
          } else if (action === "create-kr") {
            setActiveSteps(3);
          }
        })
        .catch(() => {
          notification.error({
            message: "Error",
            description: "There was an error while creating an objective",
          });
        })
        .finally(() => {
          message.destroy();
        });
    } else {
      notification.error({
        description: "Please select the date with the performance cycle",
        message: "Error",
      });
    }
  };

  return (
    <Wrapper key={props.refreshToken}>
      {/* <Button
        style={{ position: "absolute", top: "-12px" }}
        onClick={() => setActiveSteps(0)}
      >
        Reset
      </Button> */}
      {console.log(`obj item: ${JSON.stringify(props.objectiveItem)}`)}
      <Steps current={activeStep}>
        <Step title="Performance Cycle" description={PerfCycleName} />
        <Step title="Objective Type" description={ObjectiveType} />
        <Step title="Objective" description={ObjStepDescription} />
        <Step title="Key Results" description={""} />
      </Steps>
      <Divider />
      {activeStep === 0 && (
        <PerformanceCycle
          onSelect={(val: any, index: number) => {
            onCycleSelect(val, index);
            console.log(
              `performnce cycle selected: ${JSON.stringify(
                val,
              )} and index : ${JSON.stringify(index)}`,
            );
          }}
        />
      )}
      {activeStep === 1 && (
        <ObjType
          onSelect={(val: any) => onObjectiveTypeSelect(val)}
          profile={profile}
          NameFirstLetter={NameFirstLetter}
          isManager={state?.user?.is_manager}
          isSecondManager={state?.user?.is_second_manager}
          selectedObjType={props?.objectiveItem?.objective_type ?? undefined}
        />
      )}
      {activeStep === 2 && (
        <Objective
          onSubmit={(val: any, action: any) => onObjectiveSave(val, action)}
          fromDate={cycle_start_date}
          toDate={cycle_end_date}
          objectiveType={ObjectiveTypeState.type}
          user_id={state?.user?.id}
          user_name={state?.user?.display_name}
          assignRule={state?.app_settings?.settings?.assign}
          from_admin={false}
          objData={props.objectiveItem ?? undefined}
        />
      )}
      {activeStep === 3 && (
        <KeyResults
          start={obj_start_date}
          end={obj_end_date}
          description={description}
          kpi={state?.product_settings?.settings?.KPI}
          objective_id={ObjectiveID}
          assignRule={state?.app_settings?.settings?.assign}
          objectiveType={ObjectiveTypeState.type}
          performance_cycle={PerfCycleName}
          user_id={state?.user?.id}
          cycle={Cycle}
          user_name={state?.user?.display_name}
          items={krForDuplicate ?? []}
        />
      )}
      <FormFooter>
        <Button type="primary" style={{ visibility: "hidden" }}>
          Next
        </Button>
        {![2, 3].includes(activeStep) && (
          <Button type="primary" disabled={NextDisbale} onClick={onNextStep}>
            Next
          </Button>
        )}
      </FormFooter>
    </Wrapper>
  );
};

export default OkrModifier;
