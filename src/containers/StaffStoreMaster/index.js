import React, { useEffect, useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { Col, Row, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import Layout from "containers/Layout";
import "containers/StoreMaster/style/index.less";
import DragAndDroppableTable from "components/DragAndDroppableTable";
import EditIcon from "components/Icons/EditIcon";
import TrashIcon from "components/Icons/TrashIcon";
import DragIcon from "components/Icons/DragIcon";
import FormHeader from "components/FormHeader";
import SettingsIcon from "components/Icons/SettingsIcon";

import {
  deleteStaffStore,
  fetchAllstaffStoresByStoreId,
  reOrderstaffStores,
  setAllstaffStores,
  setIsCreatedStaffStore,
} from "actions/staffStore";
import { setLoading } from "actions/common";

const { confirm } = Modal;

export default function StaffStoreMaster() {
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
      title: "担当者名",
      dataIndex: "name",
    },
    {
      title: "表示設定",
      dataIndex: "isDisplayed",
    },
    {
      title: "",
      dataIndex: "edit",
      width: 70,
      render: function renderEditIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div onClick={() => editStaffStore(record.key)} style={customStyles}>
            <EditIcon customeStyles={customStyles} />
          </div>
        ) : null;
      },
    },
    {
      title: "",
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

  const dispatch = useDispatch();
  const history = useHistory();

  // useSelector
  const staffStores = useSelector(
    (state) => state.staffStoreMasterReducer.staffStores
  );
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  // useState
  const [dataSource, setDataSource] = useState([]);
  const [fullDataSource, setFullDataSource] = useState([]);

  useEffect(() => {
    dispatch(setIsCreatedStaffStore(false));
  });

  useEffect(() => {
    if (!staffStores.data && selectedStore.id > 0) {
      dispatch(fetchAllstaffStoresByStoreId(selectedStore.id));
    }
    dispatch(setLoading(true));
    dispatch(setIsCreatedStaffStore(false));
  }, []);

  useEffect(() => {
    if (staffStores.data) {
      const formattedData = formatData(staffStores.data.data);
      setDataSource(formattedData);
      setFullDataSource(formattedData);
      dispatch(setAllstaffStores(null, true));
    }
  }, [staffStores]);

  useEffect(() => {
    if (!staffStores.data && selectedStore.id > 0) {
      dispatch(setLoading(true));
      dispatch(setAllstaffStores(null, true));
      dispatch(fetchAllstaffStoresByStoreId(selectedStore.id));
    }
  }, [selectedStore]);

  function formatData(data) {
    const newData = [];
    data.forEach((row, index) => {
      newData.push({
        key: row.id,
        name: row.name,
        isDisplayed: row.isDisplayed === true ? "表示" : "非表示",
        index: index,
      });
    });
    return newData;
  }
  const showDeleteConfirm = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したデータはもとに戻せません。担当者を削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(setLoading(true));
        dispatch(deleteStaffStore(record.key, selectedStore.id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const addNew = () => {
    history.push("/settings/staff-store-master/create");
  };
  const editStaffStore = (val) => {
    history.push(`/settings/staff-store-master/edit/${val}`);
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
    dispatch(setLoading(true));
    dispatch(reOrderstaffStores(reOrderedData, selectedStore.id));
  };

  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"担当者マスタ"}
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
              addNew={addNew}
              handleDataSource={handleDataSource}
              fullDataSource={fullDataSource}
              reOrder={reOrder}
              emptyText={"該当するデータはありません。"}
              placeholder={"担当者を検索"}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
