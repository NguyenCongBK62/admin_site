import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sortableHandle } from "react-sortable-hoc";
import { useHistory } from "react-router";

import {
  deleteReservedRoute,
  fetchAllReservedRouteByStoreId,
  reOrderReservedRoute,
  setAllReservedRoute,
  setIsCreatedReservedRoute,
} from "actions/reservedRoute";

import { Col, Row, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import Layout from "containers/Layout";
import SettingsIcon from "components/Icons/SettingsIcon";
import DragAndDroppableTable from "components/DragAndDroppableTable";
import FormHeader from "components/FormHeader";
import DragIcon from "components/Icons/DragIcon";
import EditIcon from "components/Icons/EditIcon";
import TrashIcon from "components/Icons/TrashIcon";

const { confirm } = Modal;

export default function ReservedRouteMaster() {
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
      title: "予約経路",
      dataIndex: "name",
    },
    {
      title: "表示設定",
      dataIndex: "isDisplayed",
    },
    {
      title: " ",
      dataIndex: "edit",
      width: 70,
      render: function renderEditIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div
            onClick={() => editReservedRoute(record.key)}
            style={customStyles}
          >
            <EditIcon customStyles={customStyles} />
          </div>
        ) : null;
      },
    },
    {
      title: " ",
      dataIndex: "delete",
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
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  const reservedRouteData = useSelector(
    (state) => state.reservedRouteMasterReducer.reservedRouteData
  );

  // useEffect
  useEffect(() => {
    dispatch(setIsCreatedReservedRoute(false));
  });

  useEffect(() => {
    if (!reservedRouteData) {
      dispatch(fetchAllReservedRouteByStoreId(selectedStore.id));
    }
  }, []);

  useEffect(() => {
    if (reservedRouteData) {
      const formattedData = formatData(reservedRouteData);
      setDataSource(formattedData);
      setFullDataSource(formattedData);
      dispatch(setAllReservedRoute(null, false));
    }
  }, [reservedRouteData]);

  useEffect(() => {
    if (!reservedRouteData) {
      dispatch(setAllReservedRoute(null, false));
      dispatch(fetchAllReservedRouteByStoreId(selectedStore.id));
    }
  }, [selectedStore]);

  // methods
  const DragHandle = sortableHandle(() => (
    <DragIcon customStyles={{ cursor: "grab" }} />
  ));

  const addNew = () => {
    history.push("/settings/reservation-route-master/create");
  };

  const editReservedRoute = (val) => {
    history.push(`/settings/reservation-route-master/edit/${val}`);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したデータはもとに戻せません。予約経路を削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(deleteReservedRoute(record.key, selectedStore.id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

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
    dispatch(reOrderReservedRoute(reOrderedData, selectedStore.id));
  };

  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"予約経路設定"}
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
              placeholder={"予約経路を検索"}
              emptyText={"条件に該当する予約経路はありません"}
              reOrder={reOrder}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
