import React, { useEffect, useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Col, Row, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import {
  fetchCustomItems,
  setCustomItems,
  deleteCustomItem,
  reOrderCustomItems,
} from "actions/customItemsAction";

import Layout from "containers/Layout";
import "containers/StoreMaster/style/index.less";
import DragAndDroppableTable from "components/DragAndDroppableTable";

import EditIcon from "components/Icons/EditIcon";
import TrashIcon from "components/Icons/TrashIcon";
import DragIcon from "components/Icons/DragIcon";
import FormHeader from "components/FormHeader";
import FileTextIcon from "components/Icons/FileTextIcon";

const { confirm } = Modal;

export default function CustomItems() {
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
      title: "項目名",
      dataIndex: "name",
    },
    {
      title: "タイプ",
      dataIndex: "typeName",
    },
    {
      title: "必須項目",
      dataIndex: "required",
    },
    {
      title: "予約画面",
      dataIndex: "displayOnReservation",
    },
    {
      title: "お客様情報画面",
      dataIndex: "displayOnCustomer",
    },
    {
      title: "編集",
      dataIndex: "edit",
      width: 70,
      render: function renderEditIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div onClick={() => editItem(record.key)} style={customStyles}>
            <EditIcon customeStyles={customStyles} />
          </div>
        ) : null;
      },
    },
    {
      title: "削除",
      dataIndex: "delete",
      width: 70,
      render: function renderDeleteIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div onClick={() => showDeleteConfirm(record)} style={customStyles}>
            <TrashIcon customeStyles={customStyles} />
          </div>
        ) : null;
      },
    },
  ];

  const history = useHistory();
  const dispatch = useDispatch();

  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const customItems = useSelector(
    (state) => state.customItemsReducer.custom_items
  );

  const [dataSource, setDataSource] = useState([]);
  const [fullDataSource, setFullDataSource] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedStore]);

  const fetchData = () => {
    if (!customItems) {
      dispatch(fetchCustomItems(selectedStore.id));
    }
  };

  useEffect(() => {
    if (customItems) {
      const formattedData = formatData(customItems.data);
      setDataSource(formattedData);
      setFullDataSource(formattedData);
      dispatch(setCustomItems(null));
    }
  }, [customItems]);

  function formatData(data) {
    const newData = [];
    data.forEach((row, index) => {
      newData.push({
        key: row.id,
        name: row.name,
        typeName: row.type.name,
        required: row.required ? "必須" : "任意",
        displayOnReservation: row.displayOnReservation
          ? "表示する"
          : "表示しない",
        displayOnCustomer: row.displayOnCustomer ? "表示する" : "表示しない",
        index: index + 1,
      });
    });
    return newData;
  }

  const addNew = () => {
    history.push("/customer/custom-item/create");
  };

  const editItem = (val) => {
    const decodedId = btoa(val);
    history.push(`/customer/custom-item/edit/${decodedId}`);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したカスタム項目はもとに戻せません。カスタム項目を削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(deleteCustomItem(record.key, selectedStore.id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const DragHandle = sortableHandle(() => (
    <DragIcon customStyles={{ cursor: "grab" }} />
  ));

  const handleDataSource = (newData) => {
    setDataSource(newData);
  };

  const reOrder = (data) => {
    const reOrderedData = [];
    data.forEach((row, index) => {
      reOrderedData.push({
        id: row.key,
        displayOrder: index + 1,
      });
    });
    dispatch(reOrderCustomItems(reOrderedData, selectedStore.id));
  };

  return (
    <Layout>
      <div className="list-container">
        {/* <Row gutter={24} style={{ marginBottom: "46.17px" }}>
          <Col span={1} style={{ minWidth: "36px" }}>
            <SettingsIcon width="28" height="28" />
          </Col>
          <Col span={22}>
            <Heading classes="master-heading">カスタム項目一覧</Heading>
          </Col>
        </Row>
        <Row gutter={24}> */}
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"カスタム項目一覧"}
            icon={<FileTextIcon width="28" height="28" />}
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
              reOrder={reOrder}
              emptyText={"条件に該当するカスタム項目はありません"}
              placeholder={"カスタム項目を検索"}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
