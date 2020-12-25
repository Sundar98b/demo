import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import { v4 } from "uuid";

import HttpService from "../../services/httpService";
import Utils from "../../utils";

interface AttachmentList {
  lists: string[];
}
const Attachment = styled.div`
  background: #ffffff;
  border-radius: 3px;
  width: 200px;
  margin: 4px;
  float: left;
  height: 45px;
  line-height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: var(--light-bdr);
  &:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
`;

const Icons: any = {
  pdf: <FilePdfOutlined />,
  others: <FileOutlined />,
  png: <FileImageOutlined />,
  jpg: <FileImageOutlined />,
  jpeg: <FileImageOutlined />,
  gif: <FileImageOutlined />,
  doc: <FileWordOutlined />,
  docx: <FileWordOutlined />,
  otf: <FileWordOutlined />,
  txt: <FileTextOutlined />,
};

const Name = styled.div`
  width: 85%;
  float: left;
  padding-left: 3px;
  a {
    color: #000;
  }
  .ant-skeleton-button {
    width: 101%;
    top: 10px;
    position: relative;
  }
`;
const Icon = styled.div`
  width: 12%;
  float: left;
  height: 23px;
  position: relative;
  background: ${props => props.color};
  top: 11px;
  line-height: 23px;
  text-align: center;
  border-radius: 2px;
  margin: 1px;
`;
const Wrapper = styled.div``;
const AttachmentList: React.FC<AttachmentList> = props => {
  const [Lists, setLists] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);
  useEffect(() => {
    if (props.lists?.length) {
      HttpService.get("attachments/lists", "", {
        lists: props.lists,
      }).then(res => {
        setLists(res);
        setisLoaded(true);
      });
    }
  }, [props.lists]);

  const getIcon = (name: string) => {
    const iconList = name.split(".");
    let icon = iconList[iconList.length - 1] || "";
    icon = icon.toLowerCase();
    return Icons[icon] || Icons.others;
  };

  return (
    <Wrapper className="clearfix">
      {!isLoaded &&
        props.lists?.map(item => (
          <Attachment key={v4()}>
            <Icon>
              <Skeleton.Button active size="small" shape="circle" />
            </Icon>
            <Name>
              <Skeleton.Button active size="small" />
            </Name>
          </Attachment>
        ))}
      {isLoaded &&
        Lists?.map((item: any) => (
          <Attachment key={v4()}>
            <Icon color={Utils.getRandomColor()}>{getIcon(item.name)}</Icon>
            <Name>
              <a download={item.name} href={item.url}>
                {item.name}
              </a>
            </Name>
          </Attachment>
        ))}
    </Wrapper>
  );
};

export default AttachmentList;
