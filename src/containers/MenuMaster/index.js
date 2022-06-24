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
import SettingsIcon from "components/Icons/SettingsIcon";
import FormHeader from "components/FormHeader";

import { setLoading } from "actions/common";
import {
  deleteMenu,
  fetchAllMenuList,
  reOrderMenus,
  setAllMenuList,
  setCreatedMenu,
} from "actions/menu";

const { confirm } = Modal;

export default function MenuMaster() {
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
      title: "	メニュー名",
      dataIndex: "name",
    },
    {
      title: "料金",
      dataIndex: "price",
    },
    {
      title: "表示設定",
      dataIndex: "displayStatus",
    },
    {
      title: "編集",
      dataIndex: "edit",
      width: 70,
      render: function renderEditIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div onClick={() => editMenu(record.key)} style={customStyles}>
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

  const dispatch = useDispatch();
  const history = useHistory();

  // useSelector
  const menuList = useSelector((state) => state.menuMasterReducer.menuList);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  // useState
  const [dataSource, setDataSource] = useState([]);
  const [fullDataSource, setFullDataSource] = useState([]);

  useEffect(() => {
    if (!menuList) {
      dispatch(fetchAllMenuList(selectedStore.id));
    }
    dispatch(setLoading(true));
    dispatch(setCreatedMenu(false));
  }, []);

  useEffect(() => {
    if (menuList) {
      const formattedData = formatData(menuList.data);
      setDataSource(formattedData);
      setFullDataSource(formattedData);
      dispatch(setAllMenuList(null));
      dispatch(setCreatedMenu(false));
    }
  }, [menuList]);

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(setAllMenuList(null));
    dispatch(fetchAllMenuList(selectedStore.id));
  }, [selectedStore]);

  function formatData(data) {
    const newData = [];
    data.forEach((row, index) => {
      newData.push({
        key: row.id,
        name: row.name,
        price: row.price + "円",
        displayStatus: row.displayStatus === true ? "表示" : "非表示",
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
        "削除したデータはもとに戻せません。メニューを削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(setLoading(true));
        dispatch(deleteMenu(record.key, selectedStore.id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const addNew = () => {
    history.push("/settings/menu-master/create");
  };
  const editMenu = (val) => {
    history.push(`/settings/menu-master/edit/${val}`);
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
        menuId: row.key,
        displayOrder: index + 1,
      });
    });
    dispatch(setLoading(true));
    dispatch(reOrderMenus(reOrderedData, selectedStore.id));
  };

  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"メニューマスタ"}
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
              emptyText={"条件に該当するメニューはありません"}
              placeholder={"メニューを検索"}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
