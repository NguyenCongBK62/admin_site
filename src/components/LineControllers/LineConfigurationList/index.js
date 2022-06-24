/* eslint-disable react/display-name */
import React from "react";

import { Col, Row } from "antd";
import PropTypes from "prop-types";

// import Layout from "containers/Layout";
import TrashIcon from "components/Icons/TrashIcon";
import FormHeader from "components/FormHeader";
// import Table from "components/Table";
import LineLogo from "components/Icons/LineLogo";
import LineColumnIcon from "components/Icons/LineColumnIcon";
import DragAndDroppableTable from "components/DragAndDroppableTable";

export default function LineConfigurationList({ data, deleteConfigHandler }) {
  const customStyles = {
    cursor: "pointer",
  };
  const columns = [
    {
      dataIndex: "sort",
      width: 51,
      render: function renderLineColumnIcon(_, record) {
        return (
          <div>
            <LineColumnIcon />
          </div>
        );
      },
    },
    {
      title: "LINE ID",
      dataIndex: "botBasicId",
    },
    {
      title: "サービス名",
      dataIndex: "channelName",
    },
    {
      title: "削除",
      dataIndex: "",
      width: 70,
      render: function renderDeleteIcon(_, record) {
        return data.length >= 1 ? (
          <div onClick={() => deleteConfigHandler(record)} style={customStyles}>
            <TrashIcon customStyles={customStyles} />
          </div>
        ) : null;
      },
    },
  ];

  return (
    <div className="list-container">
      <Row style={{ marginBottom: "6.17px" }}>
        <FormHeader
          title={"LINE連携"}
          icon={<LineLogo width="28" height="28" />}
        />
      </Row>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col span={24}>
          <DragAndDroppableTable
            data={data}
            columns={columns}
            emptyText={"条件に該当するテーブルはありません"}
            hasAddBtn={false}
            hasSearchField={false}
          />
        </Col>
      </Row>
    </div>
  );
}

LineConfigurationList.propTypes = {
  data: PropTypes.array,
  deleteConfigHandler: PropTypes.func,
};
