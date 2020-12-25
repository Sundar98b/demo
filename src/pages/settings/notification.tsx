import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Button, Divider, Switch, message, notification } from "antd";
import { Link } from "react-router-dom";

import HttpService from "../../services/httpService";
import Rolecheck from "../../components/role-check";
import TitleCard from "../../components/title-card";
import Utils from "../../utils";

const InitalData: any = {
  weekly_reports: true,
  monthly_reports: true,
  performance_cycle_end_reports: true,
  task_assign_notification: true,
  objective_assign_notification: true,
  objective_closure_to_line_manager: true,
  checkin_notification_to_line_manager: true,
  key_results_assign_notification: true,
  weekly_remainders: true,
  due_date_reminder_3_days_before: true,
  due_date_reminder_on_the_date: true,
  team_member_addition_deletion_notification_to_the_manager: true,
  new_user_notification_to_the_user: true,
  role_change_notification_to_the_user: true,
};

const Notification: React.FC = () => {
  useEffect(() => {
    message.loading("Loading...");

    const id = (window as any).tenant_id || "";
    HttpService.get("notification-settings/" + id)
      .then(res => {
        setdata({ ...InitalData, ...res.settings });
        setId(res.id);
      })
      .finally(() => {
        message.destroy();
      });
  }, []);
  const [Id, setId] = useState("");

  const onSave = () => {
    message.loading("Updating ...");
    HttpService.put("notification-settings", Id, { settings: data })
      .then(() => {
        notification.success({
          message: "Notification Settings updated sucessfully",
        });
      })
      .catch(() => {
        notification.error({
          message: "Problem while updating the Notification Settings",
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  const [data, setdata] = useState(InitalData);
  const Table = styled.table`
    width: 60%;
    border: 1px solid #e6eaed;

    tr {
      &:hover {
        background: #f3f8fe;
      }
    }
    td,
    th {
      padding: 10px 10px 10px 5px;
    }
    tbody tr {
      border-bottom: 1px solid #e6eaed;
    }
  `;

  const onChange = (key: string, val: boolean) => {
    const newData = { ...data, [key]: val };
    setdata(newData);
  };
  return (
    <Rolecheck module="Notification" fullpage>
      <TitleCard title="Notification Settings" />
      <Table>
        <tbody>
          {Object.keys(data).map((item: any) => (
            <tr key={item}>
              <th style={{ width: "80%" }}>{Utils.titleCase(item)}</th>
              <th className="tc">
                <Switch
                  checked={data[item]}
                  onChange={(val: any) => onChange(item, val)}
                />
              </th>
            </tr>
          ))}
        </tbody>
      </Table>
      <Divider />
      <p className="tr">
        <Button>
          <Link to="/settings/notification"> Cancel </Link>
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={onSave} style={{ marginRight: 12 }}>
          Save
        </Button>
      </p>
    </Rolecheck>
  );
};

export default Notification;
