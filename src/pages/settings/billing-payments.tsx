import React from "react";
import styled from "styled-components";
import { Tag } from "antd";

import TableComponent from "../../components/table-component";
import TitleCard from "../../components/title-card";

const Data = styled.div`
  width: 50%;
  float: left;
`;
const Label = styled.div`
  width: 50%;
  float: left;
  font-weight: 800;
`;
const data = [
  {
    subscription_id: "12313",
    plan: "Free Tier",
    status: "Paid",
    name: "Naveen",
    email: "naveenda360@gmail.com",
    phone: "8124733754",
    created_at: "12-04-2020",
    next_bill: "12-04-2020",
    price: "220",
  },
  {
    subscription_id: "1231s3",
    plan: "Free Tier",
    status: "Paid",
    name: "Naveen",
    email: "naveenda360@gmail.com",
    phone: "8124733754",
    created_at: "12-03-2020",
    next_bill: "12-04-2020",
    price: "220",
  },
];

const Columns = [
  {
    name: "Plan Info",
    render: (row: any) => {
      return (
        <>
          <div>
            <Label>Subscription ID</Label>
            <Data>#{row.subscription_id}</Data>
          </div>
          <div>
            <Label>Status</Label>
            <Data>
              <Tag color="green">{row.status}</Tag>
            </Data>
          </div>
          <div>
            <Label>Plan</Label>
            <Data>{row.plan}</Data>
          </div>
        </>
      );
    },
  },
  {
    name: "Biller Info",
    render: (row: any) => {
      return (
        <>
          <div>
            <Label>Name</Label>
            <Data>#{row.subscription_id}</Data>
          </div>
          <div>
            <Label>Email</Label>
            <Data>{row.email}</Data>
          </div>
          <div>
            <Label>Phone Number</Label>
            <Data>{row.phone}</Data>
          </div>
        </>
      );
    },
  },
  {
    name: "Date & Price info",
    render: (row: any) => {
      return (
        <>
          <div>
            <Label>Price</Label>
            <Data>USD : {row.price}</Data>
          </div>
          <div>
            <Label>Created At</Label>
            <Data>{row.created_at}</Data>
          </div>

          <div>
            <Label>Next Cycle</Label>
            <Data>{row.next_bill}</Data>
          </div>
        </>
      );
    },
  },
];

const Subscription: React.FC = () => {
  return (
    <>
      <TitleCard title="Billing & Payments" />
      <TableComponent data={data} columns={Columns} />
    </>
  );
};

export default Subscription;
