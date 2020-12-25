import styled from "styled-components";
import React, { ReactNode } from "react";
import { Popover, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface TitleCardPros {
  title?: ReactNode | string;
  help?: boolean;
  helpText?: ReactNode | string;
  extra?: ReactNode | string;
  [x: string]: any;
}
const { Title } = Typography;
const Wrapper = styled.span`
  vertical-align: text-bottom;
  padding-left: 12px;
  color: #738297;
  cursor: pointer;
`;
const P = styled.p`
  float: right;
`;
const HelpCard = styled.div`
  max-width: 300px;
`;
const Div = styled.div``;
const TitleCard: React.FC<TitleCardPros> = props => {
  const Tag = props.title ? Title : Div;
  return (
    <Tag level={3}>
      {props.extra && <P>{props.extra}</P>}
      {props.title}
      {props.help && (
        <Wrapper>
          <Popover
            content={<HelpCard>{props.helpText}</HelpCard>}
            placement="right"
          >
            <QuestionCircleOutlined style={{ fontSize: 12 }} />
          </Popover>
        </Wrapper>
      )}
    </Tag>
  );
};

TitleCard.defaultProps = {
  help: false,
  //@todo  : Remove
  helpText: ``,
};

export default TitleCard;
