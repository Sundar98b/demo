import React, { useState } from "react";
import { Button, Modal, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { v4 } from "uuid";

import CsvImport from "./csv-import";
import Rolecheck from "../../components/role-check";
import TableComponent from "../../components/table-component";
import TaskCSV from "../../assets/sample-csv/task.csv";
import UserCSV from "../../assets/sample-csv/user.csv";

const data = [
  {
    name: "Users",
    sample: UserCSV,
  },
  {
    name: "Tasks",
    sample: TaskCSV,
  },
];

const ImportData: React.FC = () => {
  const [modalVisible, setmodalVisible] = useState(false);
  const [Module, setModule] = useState("");
  const importCsvModal = (module: string) => {
    toggleModal();
    setModule(module);
  };

  const toggleModal = () => {
    setmodalVisible(!modalVisible);
  };

  const Columns = [
    {
      name: "Module",
      key: "name",
    },
    {
      name: "Sample File",
      key: "sample",
      render: (row: any) => {
        return (
          <a href={row.sample} download={row.name + "-sample.csv"}>
            Download Sample
          </a>
        );
      },
    },
    {
      name: "Action",
      render: (row: any) => {
        return (
          <div>
            <Button
              shape="round"
              onClick={() => importCsvModal(row.name)}
              icon={<UploadOutlined />}
            >
              Import
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Rolecheck module="Data Import" fullpage>
      <Modal
        bodyStyle={{ paddingBottom: 80 }}
        width={800}
        className="import-csv"
        onCancel={toggleModal}
        onOk={toggleModal}
        visible={modalVisible}
        key={v4()}
      >
        <CsvImport module={Module} />
      </Modal>
      <Typography.Title level={4}>CSV Data Import</Typography.Title>
      <TableComponent data={data} columns={Columns} />
    </Rolecheck>
  );
};

export default ImportData;
