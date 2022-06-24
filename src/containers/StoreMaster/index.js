import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { sortableHandle } from "react-sortable-hoc";

import { Col, Row, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import Layout from "containers/Layout";
import "containers/StoreMaster/style/index.less";
import FormHeader from "components/FormHeader";
import DragAndDroppableTable from "components/DragAndDroppableTable";
import EditIcon from "components/Icons/EditIcon";
import TrashIcon from "components/Icons/TrashIcon";
import DragIcon from "components/Icons/DragIcon";
import SettingsIcon from "components/Icons/SettingsIcon";

import {
  deleteStore,
  getMaxStore,
  isCreatedStore,
  reOrderStores,
} from "actions/store";
import { translateStoreStatus } from "utils/common";
import { setLoading } from "actions/common";

const { confirm } = Modal;

export default function StoreMaster() {
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
      title: "店舗名",
      dataIndex: "name",
      className: "drag-visible",
    },
    {
      title: "営業時間",
      dataIndex: "businessHours",
    },
    {
      title: "定休日",
      dataIndex: "weeklyHolidays",
    },
    {
      title: "営業状況",
      dataIndex: "status",
    },
    {
      title: "編集",
      dataIndex: "edit",
      width: 70,
      render: function renderEditIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div onClick={() => editStore(record.key)} style={customStyles}>
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
  const storeList = useSelector((state) => state.layoutReducer.stores);
  const maxStore = useSelector((state) => state.storeMasterReducer.maxStore);
  const [dataSource, setDataSource] = useState([]);
  const [fullDataSource, setFullDataSource] = useState([]);

  useEffect(() => {
    if (storeList.length === 0) {
      dispatch(setLoading(true));
    }
    dispatch(isCreatedStore(false));
  }, []);

  useEffect(() => {
    if (storeList.length >= 0) {
      // dispatch(setLoading(false));
      const formattedData = formatData(storeList);
      setDataSource(formattedData);
      setFullDataSource(formattedData);
      dispatch(getMaxStore(storeList.length));
    }
  }, [storeList]);

  function formatData(data) {
    const newData = [];
    data.forEach((row, index) => {
      // businessHours
      let businessHours = "";
      for (let i = 0; i < row.businessHours.length; i++) {
        businessHours +=
          "" +
          row.businessHours[i].openHours +
          "~" +
          row.businessHours[i].closeHours +
          (i < row.businessHours.length - 1 ? "、" : "") +
          "";
      }
      // weeklyHolidays
      let weeklyHolidays = "";
      for (let i = 0; i < row.weeklyHolidays.length; i++) {
        weeklyHolidays +=
          row.weeklyHolidays[i].name +
          (i < row.weeklyHolidays.length - 1 ? "、" : "");
      }
      if (row.hasHolidays === true) {
        if (row.weeklyHolidays.length > 0) {
          weeklyHolidays += "、祝日";
        } else {
          weeklyHolidays += "祝日";
        }
      }
      newData.push({
        key: row.id,
        name: row.name,
        businessHours: businessHours,
        weeklyHolidays: weeklyHolidays,
        status: translateStoreStatus(row.status),
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
        "削除したデータはもとに戻せません。店舗を削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(setLoading(true));
        dispatch(deleteStore(record.key));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const addNew = () => {
    if (storeList.length === 0) {
      history.push("/settings/store-master/create");
    } else {
      if (maxStore) {
        history.push("/settings/store-master/create");
      } else {
        message.error({
          content: "登録できる店舗数が上限に達しています。",
          style: {
            color: "#EB516D",
          },
        });
      }
    }
  };
  const editStore = (storeId) => {
    history.push(`/settings/store-master/edit/${storeId}`);
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
        storeId: row.key,
        displayOrder: index + 1,
      });
    });
    dispatch(setLoading(true));
    dispatch(reOrderStores(reOrderedData));
  };

  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"店舗マスタ"}
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
              emptyText={"該当する店舗はありません。"}
              placeholder={"店舗を検索"}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
