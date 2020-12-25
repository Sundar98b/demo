import moment from "moment";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import Utils from "../../utils";

const Wrapper = styled.div`
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
`;
const Time = styled.time`
  font-size: 10px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
`;

interface Notification {
  refreshToken: string;
}

const Notification: React.FC<Notification> = props => {
  const store = useSelector((store: any) => store.INITIAL_DATA);
  const history = useHistory();
  const [data, setdata] = useState([]);
  useEffect(() => {
    if (store.notifications) {
      setdata(store.notifications);
    }
  }, [store]);

  useEffect(() => {
    HttpService.get("others/notifications");
  }, [props]);

  return (
    <Wrapper>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item onClick={() => history.push("/" + item.url)}>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor:
                      Utils.SystemColor[item.image?.toUpperCase()],
                  }}
                >
                  {item.image?.toUpperCase()}
                </Avatar>
              }
              title={
                <a
                  href="#notification"
                  onClick={e => {
                    e.preventDefault();
                    history.push("/" + item.url);
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.message }} />
                </a>
              }
            />
            <Time>{moment(item.created_on).fromNow()}</Time>
          </List.Item>
        )}
      />
    </Wrapper>
  );
};

export default Notification;
