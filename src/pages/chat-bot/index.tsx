import faker from "faker";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { CloseCircleFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import bg from "../../assets/cool-background.png";
import { showChatBot } from "../../redux/actions/show-chatbot";

const Wrapper = styled.div`
  position: absolute;
  width: 350px;
  z-index: 1200;
  background: #fff;
  height: 90vh;
  left: 70px;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.25);
  top: 52px;
  border-radius: 4px;
`;
const Header = styled.div`
  /* background: linear-gradient(90deg, #5d067e -7.91%, #6e48aa 120.08%); */
  background: url(${bg});
  border-radius: 5px 5px 0px 0;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 200px;
  h3 {
    font-weight: 300;
    font-size: 21px;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #000;
    margin-right: 10px;
    text-transform: capitalize;
    padding: 16px;
  }
`;
//nneed to change bg
const Data = styled.div`
  background: #ffffff;
  height: 88%;
  position: relative;
  top: -133px;
  width: 95%;
  margin: 0 auto;
  border-radius: 6px;
  overflow-y: auto;
  overflow-x: hidden;
`;
const Icon = styled.div`
  cursor: pointer;
  text-align: right;
  position: absolute;
  right: 8px;
  color: #fff;
  top: 6px;
`;
const messages: { text: string; type: string }[] = [];

for (let index = 0; index < 40; index++) {
  messages.push({
    text: faker.company.catchPhrase(),
    type: faker.random.arrayElement(["from", "to"]),
  });
}

const Backdrop = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vw;
  top: 0;
  left: 0;
  z-index: 1000;
`;
const ChatBot: React.FC = () => {
  const [isVisisble, setisVisisble] = useState(false);
  const state = useSelector((store: any) => store.SHOW_CHATBOX);
  const dispacther = useDispatch();
  useEffect(() => {
    setisVisisble(!!state);
  }, [state]);
  const close = () => {
    setisVisisble(false);
    dispacther(showChatBot(false));
  };
  return (
    <>
      <Wrapper style={{ display: isVisisble ? "block" : "none" }}>
        <Header>
          <Icon onClick={close}>
            <CloseCircleFilled />
          </Icon>
          <h3>How can I help you?</h3>
        </Header>
        <Data>Hello ChatBot</Data>
      </Wrapper>
      {isVisisble && <Backdrop onClick={close} />}
    </>
  );
};

export default ChatBot;
