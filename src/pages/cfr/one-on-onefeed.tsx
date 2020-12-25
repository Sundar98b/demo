import React, { useState } from "react"
import styled from "styled-components";
import { Button, Card, Form, Input, Radio, Select, Tabs } from "antd";
import { DatePicker, Space, TimePicker } from "antd";
// import{BrowserRouter,Link} from "react-router-dom"
import Moment from 'moment';


const Leftfeed = styled.div`
  
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Rightfeed = styled.div`
  
  width: 45%;
  box-shadow: -9px 0px 9px -13px rgba(0,0,0,0.75);
  padding: 2% 0 0 2%;`
;

const Feedback = styled.div`
  display: flex;
  height: 90%;
  justify-content: space-around;
`;

const Header = styled.h2`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8%;
`;
const Wrapper = styled.div`
  overflow-y: auto;
  height:100%;
  .card-row {
    border: 1px solid rgb(235, 237, 240);
    padding: 0 12px;
    margin-bottom: 12px;
    padding-top: 12px;
    padding-bottom: 12px;
    height:100%;
  }
`;

const OneonOneFeed: React.FC = (props:any) =>{
    const { Option } = Select;
    const RangePicker  = TimePicker;
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const { TabPane } = Tabs;

    let [value , setValue] = useState<any>("To Team")
    let [istoteam,setIstoteam] = useState<any>(false)
    let [istomanager,setIstomanager] = useState<any>(false)
    let [employee , setEmployee] = useState<any>("")
    // const {tenant_id} = props.location.state
    // const {user_id} = props.location.state
    

    const Selectedfeedback = (e:any) =>{    
        setValue(e.target.value)
        form.resetFields();
    }
    const onFinish =(e:any) =>{
        let obj={date:Moment(e.date).format('DD-MM-YYYY')}
        delete e.date
        e=Object.assign(e,obj)
        let time=[Moment(e.time[0]).format('HH:mm:ss'),Moment(e.time[1]).format('HH:mm:ss')]
        let obj1={time:time}
        delete e.time
        e=Object.assign(e,obj1)
        console.log(e)
        form.resetFields();
    }
    const Messages = (key:any) =>{
        console.log(key)
    }

    return(
        <>
        <Wrapper>
        <Header style={{padding:"0px"}}>One on One Feedback</Header>
        <Feedback>
            <Leftfeed>
                    <Radio.Group onChange={Selectedfeedback} value={value} style={{paddingTop:"10%" , paddingBottom:"10%"}}>
                        <Radio disabled={istoteam} value={"To Team"}>To Team</Radio>
                        <Radio disabled={istomanager} value={"To Manager"}>To Manager</Radio>
                    </Radio.Group>
                <div style={{height:"100%" , width:"75%"}}>
                <Form onFinish={onFinish} form={form} >
                    <Form.Item
                        name="employee"
                        rules={[
                        {
                            required: true,
                            message: 'Please choose the Employee',
                        },
                        ]}
                    >
                    <Select
                        showSearch
                        style={{ width: "90%" }}
                        placeholder="Select a Employee"
                        optionFilterProp="children"
                        onSearch={employee}
                        filterOption={(input:any, option:any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                    </Select>
                    </Form.Item>
                   
                    <Space direction="vertical" size={12}>
                    <Form.Item
                        name="date"
                        rules={[
                        {
                            required: true,
                            message: 'Enter the date',
                        },
                        ]}
                    >
                        <DatePicker  />
                        
                    </Form.Item>
                    <Form.Item
                        name="time"
                        rules={[
                        {
                            required: true,
                            message: 'Enter the time',
                        },
                        ]}
                    >
                        <RangePicker />
                        
                    </Form.Item>
                    </Space>
                    <Form.Item
                        name="agenda"
                        rules={[
                        {
                            required: true,
                            message: 'Enter the Agenda',
                        },
                        ]}
                    >
                        <TextArea
                            placeholder="Enter Agenda for meeting"
                            autoSize={{ minRows: 2, maxRows: 3 }}
                        />
                    </Form.Item>
                    <Form.Item
                    
                    >
                    {/* <div><Link to={{pathname:"/feedback",state:{user_id: user_id, tenant_id:tenant_id}}}><Button className="submitbutton" type="primary" >Go Back</Button></Link></div> */}
                    <div><Button type="primary" htmlType="submit">Submit</Button></div>
                    </Form.Item>
                </Form>
                </div>
            </Leftfeed>
            <Rightfeed>
                <Tabs defaultActiveKey="Scheduled" onChange={Messages}>
                    <TabPane tab="Scheduled" key="Scheduled">
                    Content of Tab Pane 1
                    </TabPane> 
                    <TabPane tab="Completed" key="Completed">
                    Content of Tab Pane 2
                    </TabPane>
                </Tabs>
            </Rightfeed>
        </Feedback>
        </Wrapper>
        </>
    )
}

export default OneonOneFeed;