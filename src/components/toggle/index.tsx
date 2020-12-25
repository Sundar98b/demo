import styled from "styled-components";
import React, { useState } from "react";
import { v4 } from "uuid";

const Wrapper = styled.div`
  .can-toggle {
    position: relative;
    cursor: pointer;
  }
  .can-toggle *,
  .can-toggle *:before,
  .can-toggle *:after {
    box-sizing: border-box;
  }
  .can-toggle input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
  .can-toggle input[type="checkbox"][disabled] ~ label {
    pointer-events: none;
  }
  .can-toggle input[type="checkbox"][disabled] ~ label .can-toggle__switch {
    opacity: 0.4;
  }
  .can-toggle
    input[type="checkbox"]:checked
    ~ label
    .can-toggle__switch:before {
    content: attr(data-unchecked);
    left: 0;
  }
  .can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    content: attr(data-checked);
  }
  .can-toggle label {
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }
  .can-toggle label .can-toggle__label-text {
    -webkit-box-flex: 1;
    flex: 1;
    padding-left: 32px;
  }
  .can-toggle label .can-toggle__switch {
    position: relative;
    margin: 0 auto;
  }
  .can-toggle label .can-toggle__switch:before {
    content: attr(data-checked);
    position: absolute;
    top: 0;
    text-transform: uppercase;
    text-align: center;
  }
  .can-toggle label .can-toggle__switch:after {
    content: attr(data-unchecked);
    position: absolute;
    z-index: 5;
    text-transform: uppercase;
    text-align: center;
    background: white;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  .can-toggle input[type="checkbox"][disabled] ~ label {
    color: rgba(119, 119, 119, 0.5);
  }
  .can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch,
  .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch {
    background-color: #777;
  }
  .can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch:after,
  .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
    color: #5e5e5e;
  }
  .can-toggle input[type="checkbox"]:hover ~ label {
    color: #6a6a6a;
  }
  .can-toggle input[type="checkbox"]:checked ~ label:hover {
    color: #55bc49;
  }
  .can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch {
    background-color: #70c767;
  }
  .can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    color: #4fb743;
  }
  .can-toggle input[type="checkbox"]:checked:focus ~ label .can-toggle__switch,
  .can-toggle input[type="checkbox"]:checked:hover ~ label .can-toggle__switch {
    background-color: #5fc054;
  }
  .can-toggle
    input[type="checkbox"]:checked:focus
    ~ label
    .can-toggle__switch:after,
  .can-toggle
    input[type="checkbox"]:checked:hover
    ~ label
    .can-toggle__switch:after {
    color: #47a43d;
  }
  .can-toggle label .can-toggle__label-text {
    -webkit-box-flex: 1;
    flex: 1;
  }
  .can-toggle label .can-toggle__switch {
    -webkit-transition: background-color 0.3s cubic-bezier(0, 1, 0.5, 1);
    transition: background-color 0.3s cubic-bezier(0, 1, 0.5, 1);
    background: #848484;
  }
  .can-toggle label .can-toggle__switch:before {
    color: rgba(255, 255, 255, 0.5);
  }
  .can-toggle label .can-toggle__switch:after {
    -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    transition: -webkit-transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1),
      -webkit-transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    color: #777;
  }
  .can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch:after,
  .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
  }
  .can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    -webkit-transform: translate3d(65px, 0, 0);
    transform: translate3d(65px, 0, 0);
  }
  .can-toggle
    input[type="checkbox"]:checked:focus
    ~ label
    .can-toggle__switch:after,
  .can-toggle
    input[type="checkbox"]:checked:hover
    ~ label
    .can-toggle__switch:after {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
  }
  .can-toggle label {
    font-size: 14px;
  }
  .can-toggle label .can-toggle__switch {
    height: 36px;
    -webkit-box-flex: 0;
    flex: 0 0 134px;
    border-radius: 4px;
  }
  .can-toggle label .can-toggle__switch:before {
    left: 67px;
    font-size: 12px;
    line-height: 36px;
    width: 67px;
    padding: 0 12px;
  }
  .can-toggle label .can-toggle__switch:after {
    top: 2px;
    left: 2px;
    border-radius: 2px;
    width: 65px;
    line-height: 32px;
    font-size: 12px;
  }
  .can-toggle label .can-toggle__switch:hover:after {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
  }
  .can-toggle input[type="checkbox"][disabled] ~ label {
    color: rgba(181, 62, 116, 0.5);
  }
  .can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch,
  .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch {
    background-color: #b53e74;
  }
  .can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch:after,
  .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
    color: #8f315c;
  }
  .can-toggle input[type="checkbox"]:hover ~ label {
    color: #a23768;
  }
  .can-toggle input[type="checkbox"]:checked ~ label:hover {
    color: #aa3a6d;
  }
  .can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch {
    background-color: #c14b81;
  }
  .can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    color: #a23768;
  }
  .can-toggle input[type="checkbox"]:checked:focus ~ label .can-toggle__switch,
  .can-toggle input[type="checkbox"]:checked:hover ~ label .can-toggle__switch {
    background-color: #b53e74;
  }
  .can-toggle
    input[type="checkbox"]:checked:focus
    ~ label
    .can-toggle__switch:after,
  .can-toggle
    input[type="checkbox"]:checked:hover
    ~ label
    .can-toggle__switch:after {
    color: #8f315c;
  }
  .can-toggle label .can-toggle__label-text {
    -webkit-box-flex: 1;
    flex: 1;
  }
  .can-toggle label .can-toggle__switch {
    -webkit-transition: background-color 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    transition: background-color 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    background: #c14b81;
  }
  .can-toggle label .can-toggle__switch:before {
    color: rgba(255, 255, 255, 0.7);
  }
  .can-toggle label .can-toggle__switch:after {
    -webkit-transition: -webkit-transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    transition: -webkit-transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1),
      -webkit-transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    color: #b53e74;
  }
  .can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch:after,
  .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  }
  .can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
    -webkit-transform: translate3d(98px, 0, 0);
    transform: translate3d(98px, 0, 0);
  }
  .can-toggle
    input[type="checkbox"]:checked:focus
    ~ label
    .can-toggle__switch:after,
  .can-toggle
    input[type="checkbox"]:checked:hover
    ~ label
    .can-toggle__switch:after {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  }
  .can-toggle label {
    font-size: 13px;
  }
  .can-toggle label .can-toggle__switch {
    height: 40px;
    -webkit-box-flex: 0;
    flex: 0 0 200px;
    border-radius: 60px;
  }
  .can-toggle label .can-toggle__switch:before {
    left: 100px;
    font-size: 13px;
    line-height: 40px;
    width: 100px;
    padding: 0 12px;
  }
  .can-toggle label .can-toggle__switch:after {
    top: 2px;
    left: 2px;
    border-radius: 30px;
    width: 98px;
    line-height: 36px;
    font-size: 13px;
  }
  .can-toggle label .can-toggle__switch:hover:after {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  }
`;

interface ToggleButtonProps {
  onChange: Function;
  checkedText: string;
  uncheckedText: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = props => {
  const id = v4();
  const [isChecked, setisChecked] = useState(false);
  return (
    <Wrapper>
      <div className="can-toggle">
        <input
          id={id}
          type="checkbox"
          onChange={e => {
            props.onChange(
              !isChecked ? props.checkedText : props.uncheckedText,
            );
            setisChecked(!isChecked);
          }}
          checked={isChecked}
        />
        <label htmlFor={id} className="">
          <div
            className="can-toggle__switch"
            data-checked={props.checkedText}
            data-unchecked={props.uncheckedText}
          ></div>
        </label>
      </div>
    </Wrapper>
  );
};

export default ToggleButton;
