import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
interface EditProps {
  onEdit: Function;
  row: any;
}

const Btn = styled(Button)`
  color: #000;

  &:hover {
    background-color: #1890ff;
    border-color: #1890ff;
    color: #fff;
  }
`;

const Edit: React.FC<EditProps> = ({ row, onEdit }) => {
  return (
    <Btn
      size="small"
      onClick={() => onEdit(row)}
      type="link"
      icon={<EditOutlined />}
    />
  );
};

export default Edit;
