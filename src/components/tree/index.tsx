import React from "react";
import styled from "styled-components";
import { v4 } from "uuid";

import IdTag from "../id-tag";

interface Tree {
  data: {
    title: string;
    childern: any[];
  };
}

const Wrapper = styled.div`
  .item-group {
    .item-data {
      background: #fff;
      min-height: 44px;
      line-height: 44px;
      padding: 0 5px;
      border: 1px solid rgba(0, 150, 136, 0.23921568627450981);
      margin-top: 22px;
      position: relative;
      &::before {
        border-top: 2px solid #009688;
        content: "";
        height: 0;
        position: absolute;
        left: -30px !important;
        top: 1.4em;
        width: 30px;
        margin-top: -1px;
      }

      &:last-child:after {
        content: " ";
        width: 37px;
        height: 96%;
        background: #f5f0f0;
        position: absolute;
        top: 21px;
        left: -43px;
      }
    }
    .item-title {
      background: #fff;
      height: 44px;
      line-height: 44px;
      padding: 0 5px;
      border: 1px solid #009688;
    }
    .items {
      padding-left: 40px;
      padding-left: 28px;
      border-left: 2px solid #009688;
      padding-top: 4px;
      position: relative;
      margin-left: 25px;
    }
    .has-submenu {
      border: none;
      padding-left: 0;
      background: transparent;
    }
  }
`;

const Tree: React.FC<Tree> = props => {
  return (
    <Wrapper>
      <div className="item-group">
        <div className="item-title">
          <IdTag>OBJ</IdTag> {props.data.title}
        </div>
        <div className="items">
          {props.data.childern.map((level1: any) => (
            <div
              key={v4()}
              className={
                level1.childern ? "item-data has-submenu" : "item-data"
              }
            >
              {!level1.childern && level1.title}
              {level1.childern && (
                <div className="item-group ">
                  <div className="item-title">
                    <IdTag>KR</IdTag> {level1.title}
                  </div>
                  <div className="items">
                    {level1.childern.map((level2: any) => (
                      <div key={v4()} className="item-data">
                        <IdTag>KR</IdTag> {level2.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Tree;
