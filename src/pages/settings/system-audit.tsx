import React from "react";
import moment from "moment";
import { Avatar, Col, Row } from "antd";

import Rolecheck from "../../components/role-check";
import TableComponent from "../../components/table-component";
import TitleCard from "../../components/title-card";
import UserChip from "../../components/user-chip";
import Utils from "../../utils";

const data: any = [];
const colors: any = {
  add: "#1eb2a6",
  update: "#ffa34d",
  delete: "#f67575",
};

const Audit: React.FC = () => {
  const Columns = [
    {
      name: " ",
      key: "updated_on",
      sortable: true,
      render: (row: any) => {
        return (
          <Row>
            <Col span={1}>
              <Avatar style={{ background: colors[row.actions] }}>
                {Utils.titleCase(row.actions)}
              </Avatar>
            </Col>
            <Col span={23}>
              <h3>
                <strong> {row.description} </strong>
              </h3>
              <p>
                <span>{moment(row.updated_on).format("LLLL")} </span>
                <span> ({moment(row.updated_on).fromNow()})</span>
              </p>
              <div>
                <UserChip name={row.user} img={row.profile_photo} />
              </div>
            </Col>
          </Row>
        );
      },
    },
  ];

  return (
    <Rolecheck module="System Audit" fullpage>
      <TitleCard title="System Audit" />
      <TableComponent
        columns={Columns}
        entity="system-audit"
        data={data}
        searchArray={["action", "description"]}
        searchable
        pagination
        primary="description"
      />
    </Rolecheck>
  );
};

export default Audit;
