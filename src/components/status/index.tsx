import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleFilled,
  EditOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

interface StatusProps {
  name: string;
  [x: string]: any;
}
const Status: React.FC<StatusProps> = props => {
  const name = props.name;

  const Status: any = {
    open: (
      <Tag {...props} color="blue">
        Open
      </Tag>
    ),
    yet_to_submit: (
      <Tag {...props} color="warning">
        <ExclamationCircleOutlined /> Yet to submit
      </Tag>
    ),
    awaiting_for_approval: (
      <Tag {...props} color="warning">
        <ClockCircleOutlined /> Awaiting approval
      </Tag>
    ),
    closed: (
      <Tag {...props} color="success">
        <CheckCircleOutlined /> Closed
      </Tag>
    ),
    completed: (
      <Tag {...props} color="success">
        Completed
      </Tag>
    ),
    approved: (
      <Tag {...props} color="geekblue">
        <CheckCircleOutlined /> Approved
      </Tag>
    ),
    draft: (
      <Tag {...props} color="default">
        <EditOutlined /> Draft
      </Tag>
    ),
    overdue: (
      <Tag {...props} color="error">
        <ClockCircleOutlined /> Overdue
      </Tag>
    ),
    inprogress: (
      <Tag {...props} color="geekblue" icon={<SyncOutlined />}>
        In Progress
      </Tag>
    ),
    rejected: (
      <Tag {...props} color="error" icon={<CloseCircleFilled />}>
        Rejected
      </Tag>
    ),
    reassign: (
      <Tag {...props} color="purple" icon={<UserSwitchOutlined />}>
        Reassign
      </Tag>
    ),
    awaiting_for_closure: (
      <Tag {...props} color="purple" icon={<CloseCircleFilled />}>
        Awaiting for Closure
      </Tag>
    ),
  };

  return <span className="staus-cmp">{Status[name] || ""}</span>;
};

export default Status;
