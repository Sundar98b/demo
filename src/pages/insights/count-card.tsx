import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import Loader from "./loader";

interface CountCardProps {
  title: string;
  url: string;
  color: string;
  keys: string;
}

const Wrapper = styled.div`
  padding: 15px;
  border: 1px solid
    ${props =>
      props.bg ? props.bg : "linear-gradient(to right, #d53369, #cbad6d)"};
  background: ${props =>
    props.bg ? props.bg : "linear-gradient(to right, #d53369, #cbad6d)"};
  color: #fff;
  font-weight: bold;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 5px;
  &:hover {
    /* box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); */
  }
  .title {
    font-size: 0.8em;
  }
  .value {
    padding: 10px 0;
    font-size: 1.5em;
  }
  &.red {
    /* box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(244, 67, 54, 0.4); */
    background: linear-gradient(60deg, #ef5350, #e53935);
  }
  &.green {
    background: linear-gradient(60deg, #66bb6a, #43a047);
    /* box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(76, 175, 80, 0.4); */
  }
  &.amber {
    /* box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(255, 152, 0, 0.4); */
    background: linear-gradient(60deg, #ffa726, #fb8c00);
  }
  &.blue {
    background: linear-gradient(60deg, #26c6da, #00acc1);
    /* box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(0, 188, 212, 0.4); */
  }
  &.purple {
    /* box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(156, 39, 176, 0.4); */
    background: linear-gradient(60deg, #ab47bc, #8e24aa);
  }
`;

const CountCard: React.FC<CountCardProps> = props => {
  const [isLoading, setisLoading] = useState(true);
  const [CurrentCycle, setCurrentCycle] = useState();
  useEffect(() => {
    setCurrentCycle(state?.app_settings?.settings?.current_cycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state = useSelector((store: any) => store.INITIAL_DATA);

  const filters = useSelector((store: any) => store.FILTERS);
  const [value, setvalue] = useState(0);

  useEffect(() => {
    HttpService.get(
      props.url,
      {},
      {
        performance_cycle: filters.performance_cycle || CurrentCycle,
        users: filters.users,
        department: filters.department,
      },
    ).then(res => {
      if (res && res[props.keys]) {
        setvalue(res[props.keys]);
      } else {
        setvalue(0);
      }
      setisLoading(false);
    });
  }, [CurrentCycle, filters, props.keys, props.url]);

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && (
        <Wrapper className={props.color}>
          <div className="title">{props.title}</div>
          <div className="value">{value}</div>
        </Wrapper>
      )}
    </>
  );
};

export default CountCard;
