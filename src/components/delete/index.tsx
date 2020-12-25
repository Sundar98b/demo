import React from "react";
import styled from "styled-components";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteProps {
  onDelete: Function;
  row: any;
}

const Btn = styled(Button)`
  color: #000;
  &:hover {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
    color: #fff;
  }
`;

const Delete: React.FC<DeleteProps> = ({ row, onDelete }) => {
  return (
    <Popconfirm
      okText="Yes, Disable it !"
      cancelText="Cancel"
      title="Are you Sure to Disable"
      placement="left"
      onConfirm={() => {
        onDelete(row);
      }}
    >
      <Btn size="small" type="link" icon={<DeleteOutlined />} />
    </Popconfirm>
  );
};

export default Delete;
