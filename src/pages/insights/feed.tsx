import moment from "moment";
import styled from "styled-components";
import Icon, { ExpandOutlined, MessageOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Timeline } from "antd";
import { truncate } from "lodash-es";
import { useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import Loader from "./loader";
import NoDataCard from "../../components/no-data";
import UserChip from "../../components/user-chip";
import { ReactComponent as AngrySVG } from "../../assets/fb-angry.svg";
import { ReactComponent as ConfusedSVG } from "../../assets/fb-confused.svg";
import { ReactComponent as LikeSVG } from "../../assets/fb-like.svg";
import { ReactComponent as LoveSVG } from "../../assets/fb-love.svg";
import { ReactComponent as WowSVG } from "../../assets/fb-wow.svg";

const AngryIcon = (props: any) => <Icon component={AngrySVG} {...props} />;
const ConfusedIcon = (props: any) => (
  <Icon component={ConfusedSVG} {...props} />
);
const LikeIcon = (props: any) => <Icon component={LikeSVG} {...props} />;
const LoveIcon = (props: any) => <Icon component={LoveSVG} {...props} />;
const WowIcon = (props: any) => <Icon component={WowSVG} {...props} />;

const Wrapper = styled.div`
  position: relative;
  height: 213px;
  overflow-y: auto;
  padding-left: 4px;
  .expand-trigger {
    right: 25px;
    cursor: pointer;
    position: absolute;
  }
  .ant-timeline {
    text-align: left;
    padding-top: 5px;

    .ant-timeline-item-last {
      padding-bottom: 0px;
    }
  }

  .user-chip {
    transform: scale(0.7);
    left: -29px;
    position: relative;
  }
`;

const Feeds: React.FC = () => {
  const filters = useSelector((store: any) => store.FILTERS);
  const [isLoading, setisLoading] = useState(true);
  const [isEmpty, setisEmpty] = useState(false);
  const [Data, setData] = useState([]);
  const [isExpand, setisExpand] = useState(false);
  const getIcon = (props: string) => {
    switch (props) {
      case "like":
        return <LikeIcon />;
      case "love":
        return <LoveIcon />;
      case "wow":
        return <WowIcon />;
      case "confused":
        return <ConfusedIcon />;
      case "angry":
        return <AngryIcon />;
      default:
        break;
    }
  };

  useEffect(() => {
    HttpService.get(
      "insights/feeds",
      {},
      { performance_cycle: filters.performance_cycle },
    ).then(res => {
      if (res && res.length) {
        setisEmpty(false);
        setData(res);
      } else {
        setisEmpty(true);
      }
      setisLoading(false);
    });
  }, [filters.performance_cycle]);

  const toggleModal = () => {
    setisExpand(!isExpand);
  };
  return (
    <Wrapper>
      <Modal
        title="Mentions"
        visible={isExpand}
        onOk={toggleModal}
        onCancel={toggleModal}
        wrapClassName="feed-modal"
      >
        <Timeline>
          {Data.map((item: any) => (
            <>
              {item.reaction && (
                <Timeline.Item dot={getIcon(item.reaction)}>
                  reacted for KR :
                  <Link to={"/performance/checkin/e/" + item.id}>
                    {truncate(item.description, { length: 30 })}
                  </Link>{" "}
                  at {moment(item.updated_on).format("DD-MMM-YYYY")}{" "}
                  <small>({moment(item.updated_on).fromNow()})</small>
                </Timeline.Item>
              )}
            </>
          ))}
        </Timeline>
      </Modal>

      {isEmpty && <NoDataCard height={153} />}
      {!isEmpty && (
        <>
          <div className="expand-trigger" onClick={toggleModal}>
            <ExpandOutlined />
          </div>
          <h3>Mentions</h3>
          {isLoading && <Loader />}
          {!isLoading && (
            <Timeline>
              {Data.map((item: any) => (
                <>
                  {item.reaction && (
                    <Timeline.Item dot={getIcon(item.reaction)}>
                      for{" "}
                      <Link to={"/performance/checkin/e/" + item.id}>
                        {truncate(item.description, { length: 30 })}
                      </Link>{" "}
                      at {moment(item.updated_on).format("DD-MMM-YYYY")}{" "}
                      <small>({moment(item.updated_on).fromNow()})</small>
                    </Timeline.Item>
                  )}
                  {item.comments && (
                    <>
                      {item.comments.map((comment: any) => (
                        <Timeline.Item dot={<MessageOutlined />}>
                          <UserChip
                            name={comment.name}
                            img={comment.profile_photo}
                          />
                          <div className="content">{comment.comment}</div>
                        </Timeline.Item>
                      ))}
                    </>
                  )}
                </>
              ))}
            </Timeline>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default Feeds;
