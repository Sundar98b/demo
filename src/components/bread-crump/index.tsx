import styled from "styled-components";
import React, { memo } from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { isEqual } from "lodash-es";

import Utils from "../../utils";

const { xs } = Utils.MediaQuery;

const { Item } = Breadcrumb;
const Wrapper = styled.div`
  text-align: left;
  font-size: 9px;
  padding-top: 9px;
  padding-left: 16px;
  ${xs} {
    display: none;
  }
  .ant-breadcrumb {
    font-size: 12px;
  }
`;

const Breadcrumbs = memo(
  (props: { items: string[] }) => {
    return (
      <Breadcrumb>
        {props.items.map(item => (
          <Item key={item}>{item}</Item>
        ))}
      </Breadcrumb>
    );
  },
  (prev, next) => isEqual(prev, next),
);

const DIBreadCrumb: React.FC = () => {
  let location = useLocation();
  let pathname = "";
  if (location.pathname.includes("checkin/e/")) {
    location.pathname = "/performance/checkin";
  }
  if (location.pathname.includes("checkin/m/")) {
    location.pathname = "/performance/checkin";
  }

  let locationArr: any = location.pathname.split("/");
  if (locationArr[1] && locationArr[1] === "") {
    locationArr = locationArr.pop();
  }
  const locationArrLen = locationArr.length;
  locationArr = locationArr.map((item: string, index: number) => {
    if (locationArrLen - 1 !== index) {
      pathname += item + "/";
    } else {
      pathname += item;
    }
    if (item === "my-okrs") {
      item = "My OKRs";
    } else {
      item = Utils.titleCase(item);
    }
    return <Link to={pathname.replace(/\/$/, "")}> {item}</Link>;
  });
  locationArr[0] = (
    <Link to="/">
      <HomeOutlined style={{ fontSize: 12 }} />
    </Link>
  );

  return (
    <Wrapper>
      <Breadcrumbs items={locationArr} />
    </Wrapper>
  );
};

export default DIBreadCrumb;
