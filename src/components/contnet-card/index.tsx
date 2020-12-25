import styled from "styled-components";
import React, { Fragment } from "react";

import DIBreadCrumb from "../bread-crump";
import Utils from "../../utils";

const { xs } = Utils.MediaQuery;
interface ContentCard {
  breadcrumb?: boolean;
  hideOverfow?: boolean;
  color?: string;
}
const Wrapper = styled.div`
  height: CALC(100vh - 80px);
  overflow-y: ${props => (props.hideOverflow ? "hidden" : "auto")};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  //background: ${props => (props.color ? props.color : "#fff")};
  margin: 12px;
  padding: 12px;
  position: relative;
  text-align: left;
  margin-left: 0;
  background: #ffffff;
  ${xs} {
    height: CALC(100vh - 90px);
  }
`;
const ContentCard: React.FC<ContentCard> = props => {
  const newProps = { ...props };
  delete newProps.children;

  return (
    <Fragment>
      {/* {props.breadcrumb && <DIBreadCrumb />} */}
      <Wrapper
        className="content-card"
        {...newProps}
        color={props.color}
        hideOverflow={props.hideOverfow}
      >
        {props.children}
      </Wrapper>
    </Fragment>
  );
};

ContentCard.defaultProps = {
  breadcrumb: true,
};
export default ContentCard;
