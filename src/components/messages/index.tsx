import moment from "moment";
import styled from "styled-components";
import Picker, { SKIN_TONE_NEUTRAL } from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import { Col, Input, Row, message } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";

import HttpService from "../../services/httpService";
import ObjectiveTypeAvatar from "../org-type";
import { SetMessageCount } from "../../redux/actions/init";

interface MessageComponent {
  kr_id: string;
}

const Wrapper = styled.div`
  .box {
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075),
      0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);
    min-height: 2.25rem;
    width: fit-content;
  }
  .from {
    border-radius: 1.125rem 1.125rem 0 1.125rem;
    background: #000;
    color: white;
    float: right;
  }
  .to {
    float: left;
    background: #fff;
    border-radius: 1.125rem 1.125rem 1.125rem 0;
  }
`;

const ImgWarpper = styled.div`
  position: relative;
  .ant-avatar {
    height: 20px;
    width: 20px;
    position: relative;
    bottom: -17px;
    right: -2px;
  }
`;
const Messages = styled.div`
  /* border-left: 1px solid #dedede; */
  max-height: 83vh;
  overflow-y: auto;
  margin: 3px;
  padding: 12px;
  position: relative;
  padding-bottom: 56px;
  background: #f6f7fb;
  bottom: 22px;

  time {
    &::before {
      content: "";
      display: block;
    }
    font-size: 8px;
    position: absolute;
    color: #000;
    bottom: -16px !important;
    display: block;
    color: #54565a;

    width: 100%;
    &.time-from {
      text-align: right;
    }
    &.time-to {
      text-align: left;
    }
  }
`;

const MessageItem = styled.div`
  position: relative;
  display: block;
  padding: 6px 7px 8px 9px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #dedede;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16);
  float: ${props => (props.type === "from" ? "right" : "left")};
  background: ${props => (props.type === "from" ? "#e6f7ff" : "#fff")};
  margin-top: 4px;
  max-width: 500px;
`;
const MessageItemWarpper = styled.div`
  padding: 3px;
  min-height: 60px;
  margin-top: 9px;
  &::after {
    content: "";
    display: block;
  }
`;

const InputBox = styled.div`
  left: 3px;
  position: absolute;
  width: 100%;
  padding: 12px;
  bottom: 0;
  background: #fff;
  z-index: 500;
`;

const MessageComponent: React.FC<MessageComponent> = props => {
  const [userID, setuserID] = useState("");
  const [newMsg, setnewMsg] = useState("");
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [isPickerVisible, setisPickerVisible] = useState(false);
  const [isMsgSent, setIsMsgSent] = useState(false);

  const dispatcher = useDispatch();
  const togglePicker = () => {
    setisPickerVisible(!isPickerVisible);
  };
  useEffect(() => {
    const kr_id = props.kr_id;
    (window as any).sockets.off("kr-m-" + kr_id);
    (window as any).sockets.on("kr-m-" + kr_id, (val: any) => {
      const lastMessage = val[val.length - 1];
      if (lastMessage.user_id !== userID) {
        message.warning("New Message Recivied");
      }

      setListOfMessages(val);
    });
    return () => {
      (window as any).sockets.off("on", "kr-m-" + kr_id);
    };
  }, [props.kr_id, userID]);

  useEffect(() => {
    ScrollToBottom();
  });

  useEffect(() => {
    setuserID(state.user.id);
  }, [state.user]);

  const [ListOfMessages, setListOfMessages]: [any, Function] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      ScrollToBottom();
    }, 300);
  }, [setListOfMessages]);

  useEffect(() => {
    setListOfMessages([]);
    message.loading("Loading...");
    HttpService.get("others/message/" + props.kr_id).then(res => {
      setListOfMessages(res.message);
      dispatcher(SetMessageCount(parseInt(res.count, 10)));
      message.destroy();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.kr_id, isMsgSent]);

  const ScrollToBottom = () => {
    var objDiv = document.getElementById("messages-scroll");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  const SentMessage = (msg: string) => {
    if (!msg) {
      return message.error("Message is Required");
    }
    const data = {
      kr_id: props.kr_id,
      message: msg,
    };
    HttpService.post("others/sent-message", data).then(() => {
      setnewMsg("");
      setIsMsgSent(!isMsgSent);
      setTimeout(() => {
        ScrollToBottom();
      }, 100);
    });
  };

  return (
    <Wrapper className="msg-comp">
      <InputBox>
        {isPickerVisible && (
          <Picker
            onEmojiClick={(e, val) => {
              setnewMsg(newMsg + val.emoji);
              togglePicker();
            }}
            skinTone={SKIN_TONE_NEUTRAL}
            disableSkinTonePicker={true}
          />
        )}
        <Input
          autoFocus
          placeholder="Type a Message"
          prefix={
            <span className="cur-ptr" onClick={togglePicker}>
              <SmileOutlined />
            </span>
          }
          value={newMsg}
          onChange={val => {
            setnewMsg(val.currentTarget.value);
          }}
          onPressEnter={val => {
            SentMessage(val.currentTarget.value);
          }}
        />
      </InputBox>
      <Messages id="messages-scroll">
        {ListOfMessages.map((item: any) => (
          <MessageItemWarpper key={v4()}>
            <Row>
              {item.user_id !== userID && (
                <Col span={1}>
                  <ImgWarpper>
                    <ObjectiveTypeAvatar
                      type="user"
                      name={item.display_name}
                      image={item.profile_photo}
                    />
                  </ImgWarpper>
                </Col>
              )}

              <Col span={23}>
                <MessageItem
                  className={item.user_id === userID ? "box from" : "box to"}
                >
                  {item.message}
                </MessageItem>
                <time
                  className={
                    item.user_id === userID ? " time-from" : " time-to"
                  }
                >
                  {moment(item.created_on).format("MMM D, YY [at] h:mm A z")}
                </time>
              </Col>
              {item.user_id === userID && (
                <Col span={1}>
                  <ImgWarpper>
                    <ObjectiveTypeAvatar
                      type="user"
                      name={item.display_name}
                      image={item.profile_photo}
                    />
                  </ImgWarpper>
                </Col>
              )}
            </Row>
          </MessageItemWarpper>
        ))}
      </Messages>
    </Wrapper>
  );
};

export default MessageComponent;
