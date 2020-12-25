import React, { useEffect, useState } from "react"
import { Button, Card, Form, Input, Radio, Select, Tabs } from "antd";
import styled from "styled-components";

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

const Givefeedback = (props:any) =>{
    const { Option } = Select;
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const { TabPane } = Tabs;

    let [value , setValue] = useState<any>("To Team")
    let [ismanager , setIsmanager] = useState<any>(false)
    let [linemanager , setLinemanager] = useState<any>([])                  //array for storing linemanager
    let [linemanagername , setLinemanagername] = useState<any>("")          //line manager name
    let [istoteam,setIstoteam] = useState<any>(false)                       //to enable/disable the to team
    let [istomanager,setIstomanager] = useState<any>(false)                 //to enable/disable the to manager
    let [employee , setEmployee] = useState<any>([])                        // to get employee names 
    let [receiveddata,setReceiveddata] = useState<any>([])                  // to get received data from db
    let [datareceived , setDatareceived] = useState<any>([])                // changed data from received data
    let [sentdata, setSentdata] = useState<any>([])                         // to get sent data from db
    let [datasent , setDatasent] = useState<any>([])                        // changed data from sent data
    let [status,setStatus] = useState<any>("")                              //status to set the feedback is given to db or not
    let [key,setKey]= useState<any>("")                                     // Received and sent tab 
    
    const Selectedfeedback = (e:any) =>{    
        setValue(e.target.value)
        form.resetFields();
    }
    const onFinish =(e:any) =>{
    // manager && not ceo
       if(value === "To Team" && ismanager === true){ 
        let obj={emoji:"happy"} 
        e=Object.assign(e,obj)
        let a=e.employee
        a=a.split(",")
        let obj1={user_name:a[0] , user_id:a[1]}
        e=Object.assign(e,obj1)
        delete e.employee
        console.log(e)
        form.resetFields();
        }
    }
    
    return(
        <>
        <Wrapper>
        <Header style={{padding:"0px"}}>Give Feedback</Header>
        <Feedback>
            <Leftfeed>
                    <Radio.Group onChange={Selectedfeedback} value={value} style={{paddingTop:"10%" , paddingBottom:"10%"}}>
                        <Radio disabled={istoteam} value={"To Team"}>To Team</Radio>
                        <Radio disabled={istomanager} value={"To Manager"}>To Manager</Radio>
                    </Radio.Group>
                <div style={{height:"100%" , width:"75%"}}>
                <Form onFinish={onFinish} form={form} >
                    <Input style={{border:"1px solid lightgray"  , marginBottom:"24px"}}  placeholder={linemanagername}></Input>
                    <Form.Item
                        name="feedback"
                        rules={[
                        {
                            required: true,
                            message: 'Enter the message',
                        },
                        ]}
                    >
                        <TextArea
                            placeholder="Enter the message"
                            autoSize={{ minRows: 2, maxRows: 3 }}
                        />
                    </Form.Item>
                    <Form.Item
                    >
                    <div><Button type="primary" htmlType="submit">Submit</Button></div>
                    </Form.Item>
                </Form>
                </div>
            </Leftfeed>
            <Rightfeed>
                <Tabs defaultActiveKey="Sent" >
                    <TabPane tab="Received" key="Received">
                    <div>
                        <h2>Received</h2>
                    </div>
                    </TabPane> 
                    <TabPane tab="Sent" key="Sent">
                    <div>
                        <h2>Sent</h2>
                    </div>
                    </TabPane>
                </Tabs>
            </Rightfeed>
        </Feedback>
        </Wrapper>
    </>
    )
}

export default Givefeedback;