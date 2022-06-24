import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sortableHandle } from "react-sortable-hoc";
import { useHistory } from "react-router";

import { Col, Row, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import Layout from "containers/Layout";
import EditIcon from "components/Icons/EditIcon";
import SettingsIcon from "components/Icons/SettingsIcon";
import TrashIcon from "components/Icons/TrashIcon";
import DragAndDroppableTable from "components/DragAndDroppableTable";
import DragIcon from "components/Icons/DragIcon";
import FormHeader from "components/FormHeader";

import { translateSmokeStatus } from "utils/common";

import {
  deleteTable,
  fetchAllTablesByAccount,
  reOrderTables,
  setAllTablesLByAccount,
} from "actions/table";

const { confirm } = Modal;

export default function TableMaster() {
  const customStyles = {
    cursor: "pointer",
  };
  const columns = [
    {
      dataIndex: "sort",
      width: 51,
      className: "drag-visible",
      render: function dragHandleMethod() {
        return <DragHandle />;
      },
    },
    {
      title: "テーブル名",
      dataIndex: "name",
      className: "drag-visible",
    },
    {
      title: "人数",
      dataIndex: "numberOfSeats",
    },
    {
      title: "禁煙/喫煙",
      dataIndex: "smokeStatus",
    },
    {
      title: "表示設定",
      dataIndex: "displayStatus",
    },
    {
      title: "",
      dataIndex: "",
      width: 70,
      render: function renderEditIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div onClick={() => editTable(record.key)} style={customStyles}>
            <EditIcon customStyles={customStyles} />
          </div>
        ) : null;
      },
    },
    {
      title: "",
      dataIndex: "",
      width: 70,
      render: function renderDeleteIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div
            onClick={() => showDeleteConfirm(record)}
            customStyles={customStyles}
          >
            <TrashIcon customStyles={customStyles} />
          </div>
        ) : null;
      },
    },
  ];

  const dispatch = useDispatch();
  const history = useHistory();
  // useState
  const [dataSource, setDataSource] = useState([]);
  const [fullDataSource, setFullDataSource] = useState([]);

  // useSelector
  const tables = useSelector((state) => state.tableMasterReducer.tables);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  // useEffect
  useEffect(() => {
    if (!tables) {
      dispatch(fetchAllTablesByAccount(selectedStore.id));
    }
  }, []);

  useEffect(() => {
    if (tables) {
      const formattedData = formatData(tables);
      setDataSource(formattedData);
      setFullDataSource(formattedData);
      dispatch(setAllTablesLByAccount(null, true));
    }
  }, [tables]);

  useEffect(() => {
    if (!tables) {
      dispatch(setAllTablesLByAccount(null, true));
      dispatch(fetchAllTablesByAccount(selectedStore.id));
    }
  }, [selectedStore]);

  // methods

  const addNew = () => {
    history.push("/settings/table-master/create");
  };

  const editTable = (val) => {
    history.push(`/settings/table-master/edit/${val}`);
  };

  const DragHandle = sortableHandle(() => (
    <DragIcon customStyles={{ cursor: "grab" }} />
  ));

  const handleDataSource = (newData) => {
    setDataSource(newData);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したデータはもとに戻せません。テーブルを削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(deleteTable(record.key, selectedStore.id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const reOrder = (data) => {
    const reOrderedData = [];
    data.forEach((row, index) => {
      reOrderedData.push({
        tableId: row.key,
        displayOrder: index + 1,
      });
    });
    dispatch(reOrderTables(reOrderedData, selectedStore.id));
  };

  function formatData(data) {
    const newData = [];
    data.forEach((row, index) => {
      newData.push({
        key: row.id,
        name: row.name,
        numberOfSeats: row.numberOfSeats + "人",
        smokeStatus: translateSmokeStatus(row.smokeStatus),
        displayStatus: row.displayStatus === true ? "表示" : "非表示",
        index: index + 1,
      });
    });
    return newData;
  }

  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"テーブルマスタ"}
            icon={<SettingsIcon width="28" height="28" />}
          />
        </Row>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "20px" }}
        >
          <Col span={24}>
            <DragAndDroppableTable
              data={dataSource}
              columns={columns}
              handleDataSource={handleDataSource}
              fullDataSource={fullDataSource}
              addNew={addNew}
              placeholder={"テーブルを検索"}
              emptyText={"条件に該当するテーブルはありません"}
              reOrder={reOrder}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
