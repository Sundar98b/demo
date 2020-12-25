import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  Switch,
} from "antd";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

import FormFooter from "../components/form-footer";
import HttpService from "../services/httpService";
import RootPage from "./root";
import Select2 from "../components/select2";
import Utils from "../utils";

const { xs, md } = Utils.MediaQuery;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
const { Option } = Select;

const WrapperCard = styled(Card)`
  //border: 1px solid #1864ab;
  width: 100%;
  margin: 0rem;
  border: 0px;
  font-size:14px;
  ${xs} {
    width: 100%;
    margin: 0rem;
  }
  height:100%;
  .ant-card-body {
    height:100%;
    padding:0px;
  }
`;
const RGroup = styled(Radio.Group) `
    display:grid;
    grid-template-columns:repeat(2,1fr);
    grid-auto-rows:45px;
    width:60%;
    .ant-radio-button-wrapper:not(:first-child)::before {
        width:0px;
    }
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
        -webkit-box-shadow: 0 0 0 0; 
        box-shadow: 0 0 0 0; 
    }
    .ant-radio-button-wrapper:focus-within {
        -webkit-box-shadow: 0 0 0 0; 
         box-shadow: 0 0 0 0; 
    }
  .ant-radio-button-wrapper:first-child {
    border-left: 1px solid white;
    border-radius: 2px 0 0 2px;
}
`;
const RButton = styled(Radio.Button) `
    border:none;
    display:block; 
    background:white;
`;
const RFilter  = styled.div `
    padding: 2%;
    box-shadow: 3px -4px 8px 0px lightgrey;
    border: none;
    width:100%;
    .ant-form-item-control-input-content {
      display: flex;
      justify-content: center;
  }
`;
const RButtons = styled.div `
    display:flex;
    justify-content:space-around;
    padding-top:2%;
`

const { Item } = Form;
const Reports: React.FC = () => {
  const [form] = Form.useForm();
  const [forms] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const filter = useSelector((state: any) => state.FILTERS);
  const state = useSelector((state: any) => state.INITIAL_DATA?.app_settings);
  const [cycles, setCycles] = useState<any>(state.settings?.cycles);
  const [CurrentCycle, setCurrentCycle] = useState();
  const [drawer, setDrawer] = useState(false);

  const [responseData, setResponseData] = useState<any>(undefined);
  let [locationData,setLocationdata]=useState<any>([]);
  let [roleData,setRoledata]=useState<any>([]);
  let [departmentData,setDepartmentdata]=useState<any>([]);
  let designationData: any = [];

  const [performance,setPerformance] = useState<any>([])
  const [employee , setEmployee] = useState <any>("")

  useEffect(() => {
    let tempCycles = Utils.getPerformaceCycles(state.settings);
    setCycles(tempCycles);
    setCurrentCycle(filter.performance_cycle);
    return () => {
      setCycles(undefined);
    };
  }, [state]);
  useEffect(() => {
    const intialValue: any = {
      reportType:"ScoreCard"
      //performance_cycle: [CurrentCycle],
    };
    form.setFieldsValue(intialValue);
    setLoading(false);
    return () => {
      form.resetFields();
    };
  }, [form]);
  // const s2ab = s => {
  //   var buf = new ArrayBuffer(s.length);
  //   var view = new Uint8Array(buf);
  //   for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  //   return buf;
  // };
  const perfcycle = (e:any) =>{
    performance.push(e)
  }
  const Employee = (e:any) =>{
    setEmployee(e)
  }
  console.log(state)
  useEffect(()=>{
    HttpService.getFile(
      `reports/individual/summary`,
      {},
      {
        performance_cycles: performance,
        user_id: employee,
      },
      true,
    )
      .then(res => {
        setResponseData(res);
        setLoading(false);
        saveAs(res, "reports.xlsx");
        console.log(res)
      })
      .catch((err: any) => {
        console.error(err);
      });
  HttpService.get("locations")
      .then(res => {
        res.data.forEach((item: any) => {
          locationData.push(item);
        });
        setLocationdata(res.data)
      })
      .catch(() => {
        console.error("error");
      });
    HttpService.get("userroles")
      .then(res => {
        res.data.forEach((item: any) => {
          roleData.push(item);
        });
        roleData.unshift({
          name: "All Roles",
          id: null,
        });
      })
      .catch(() => {
        console.error("error");
      });
    HttpService.get("departments")
      .then(res => {
        res.data.forEach((item: any) => {
          departmentData.push(item);
        });
        setDepartmentdata(res.data)
      })
      .catch(() => {
        console.error("error");
      });

  },[])
  console.log(departmentData)
  const onSubmit = (values: any) => {
    //console.log(`form values: ${JSON.stringify(values)}`);
    console.log(values)
    form.resetFields();
    // HttpService.get(`reports/individual/summary`,{},{performance_cycles:performance , user_id : employee,},true,).then(res=>console.log(res))
   if(values.reportType === "ScoreCard" || values.reportType === undefined && performance.length !== 0){
      HttpService.getFile(
      `reports/individual/summary`,
      {},
      {
        performance_cycles: performance,
        user_id: employee,
      },
      true,
    )
      .then(res => {
        setResponseData(res);
        setLoading(false);
        saveAs(res, "Score Card.xlsx");
        console.log(res)
      })
      .catch((err: any) => {
        console.error(err);
      });
    }
    if(values.reportType === "DepartmentSummary"){
      HttpService.getFile(
      `reports/department/summary`,{},{},true,
    )
      .then(res => {
        setResponseData(res);
        setLoading(false);
        saveAs(res, "Department Summary.xlsx");
        console.log(res)
      })
      .catch((err: any) => {
        console.error(err);
      });
    }
    if(values.reportType === "IndividualPerformance"){
      HttpService.getFile(
      `reports/individual/performance/summary`,{},{},true,
    )
      .then(res => {
        setResponseData(res);
        setLoading(false);
        saveAs(res, "Individual Performance.xlsx");
        console.log(res)
      })
      .catch((err: any) => {
        console.error(err);
      });
    }
  };
  return (
    <RootPage>
      {/* <Button onClick={() => setDrawer(true)}>Open</Button> */}
      {/* <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={() => setDrawer(false)}
        visible={drawer}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer> */}
      <WrapperCard>
        <Form
          onFinish={value => onSubmit(value)}
          form={forms}
          colon={false}
          style={{height:"100%"}}
        >
          {/* <Item
            style={{ marginTop: "1rem" }}
            name="reportType"
            label="Select Report"
          >
            <Select style={{ width: "100%" }} disabled>
              <Select.Option value="overall">Overall</Select.Option>
              <Select.Option value="department">Department</Select.Option>
              <Select.Option value="individual">Individual</Select.Option>
              <Select.Option value="kr-list">KR List</Select.Option>
            </Select>
          </Item>
          <Item style={{ marginTop: "1rem" }} label=" " name="type">
            <Radio.Group disabled value={"summary"}>
              <Radio value={"summary"}>Summary</Radio>
              <Radio value={"detailed"}>Detailed</Radio>
            </Radio.Group>
          </Item> */}
          <Item
            name="reportType"
          >
            <RGroup defaultValue="ScoreCard">
                  <RButton value="ScoreCard">ScoreCard</RButton>
                  <RButton disabled value="LocationwiseReport" >Locationwise Report</RButton>
                  <RButton value="IndividualPerformance">Individual Performance</RButton>
                  <RButton disabled  value="BUReport">BU Report</RButton>
                  <RButton value="DepartmentSummary">Department Summary</RButton>
                  <RButton disabled value="CompetenceReport">Competence Report</RButton>
                  <RButton value="LocationSummary">Location Summary</RButton>
                  <RButton disabled value="SkillReport">Skill Report</RButton>
                  <RButton value="GoalSummary">Goal Summary</RButton>
                  <RButton disabled value="QuaterlyPerformanceReport">Quaterly Performance Report</RButton>  
                  <RButton value="KRList">KR List</RButton>
            </RGroup>
            </Item>
          <Item>
          <RFilter >
                <div style={{display:"flex" , alignItems:"baseline" , paddingBottom:"1%"}}>
                    <h3>Filters</h3>
                    <div>
                        <Item >
                            <Button style={{boxShadow:"none", color:"blue"}} size="small" onClick={()=>form.resetFields()}>
                            Reset
                            </Button>
                        </Item>
                    </div>
                </div>
                <Form style={{display:"flex" , flexDirection:"column"}} form={form} >
                  <div style={{display:"flex" , justifyContent:"space-between" , paddingBottom:"2%"}}>
                    <Item
                        name="Location"
                        style={{width:"30%"}}
                        >
                        <Select
                            placeholder="Select a Location"
                            filterOption={(input:any, option:any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                        {locationData.map((item:any)=><Option value={item.id}>{item.identification_name}</Option>)}
                        </Select>
                    </Item>
                    <Item
                      name="Department"
                      style={{width:"30%"}}
                    >
                        <Select
                            placeholder="Select the Department"
                            mode="multiple"
                            filterOption={(input:any, option:any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {departmentData.map((item:any)=><Option value={item.id}>{item.name}</Option>)}

                        </Select>
                        </Item>
      
                        <Item name={"user_id"} style={{width:"30%"}}>
                          <Select2
                            entity={"users/direct-reportees"}
                            entity_id="display_name"
                            placeholder="Select Member"
                            onChange={Employee}
                          ></Select2>
                        </Item>
                    </div>
                    <div style={{display:"flex" , flexDirection:"column"}}>
                        <div style={{display:"flex" , justifyContent:"space-between" }}>
                        <Item
                        name="performance_cycle"
                        style={{width:"30%"}}
                        >
                        <Select
                            placeholder="Performance Cycle"
                            allowClear
                            
                            filterOption={(input:any, option:any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={perfcycle}
                        >
                        {cycles.map((item:any)=><Option value={item.name}>{item.name}</Option>)}

                        </Select>
                        </Item>
                        <Item
                        name="ObjectiveCategory"
                        style={{width:"30%"}}
                        >
                        <Select
                            placeholder="Objective Category"
                            allowClear
                            filterOption={(input:any, option:any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="Aspirational">Aspirational</Option>
                            <Option value="Operational">Observational</Option>
                        </Select>
                        </Item >
                        </div>
                        
                    </div>
                    </Form>
            </RFilter>
          </Item>
          {/* <Item
            style={{ marginTop: "1rem" }}
            label="Performance Cycle"
            name="performance_cycle"
          >
            <Select2
              mode="multiple"
              onSelect={(value: any, options: any) => {
                console.log(
                  `select values: ${JSON.stringify(
                    value,
                  )} options: ${JSON.stringify(options)}, `,
                );
              }}
              options={
                cycles?.map((cycle: any) => {
                  cycle.value = cycle.name;
                  return cycle;
                }) || []
              }
            ></Select2>
          </Item>
          <Item name={"user_id"} label="Employee" style={{ marginTop: "1rem" }}>
            <Select2
              entity={"users/direct-reportees"}
              entity_id="display_name"
              style={{ width: "100%" }}
              placeholder="Select Member"
            ></Select2>
          </Item> */}
          <RButtons>
            <Button
              style={{ float: "right" }}
              loading={Loading}
              type="primary"
              htmlType="submit"
            >
              View
            </Button>
            <Button
              style={{ float: "right" }}
              loading={Loading}
              type="primary"
              htmlType="submit"
            >
              Download
            </Button>
            <Button
              style={{ float: "right" }}
              loading={Loading}
              type="primary"
              htmlType="submit"
            >
              Email
            </Button>
          </RButtons>
        </Form>
      </WrapperCard>
    </RootPage>
  );
};

export default Reports;
