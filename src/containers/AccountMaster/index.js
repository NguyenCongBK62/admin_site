import React, { useEffect, useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import Layout from "containers/Layout";
import "containers/StoreMaster/style/index.less";
import DragAndDroppableTable from "components/DragAndDroppableTable";
import EditIcon from "components/Icons/EditIcon";
import TrashIcon from "components/Icons/TrashIcon";
import DragIcon from "components/Icons/DragIcon";
import { Col, Row, Modal } from "antd";
import SettingsIcon from "components/Icons/SettingsIcon";
// import Heading from "components/Heading";
import { useHistory } from "react-router";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAccount,
  fetchAllAccountList,
  reOrderAccounts,
  setAllAccountList,
  setIsCreatedAccount,
} from "actions/account";
import { setLoading } from "actions/common";
import FormHeader from "components/FormHeader";

const { confirm } = Modal;

export default function AccountMaster() {
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
      title: "アカウント名",
      dataIndex: "name",
      className: "drag-visible",
    },
    {
      title: "対象店舗",
      dataIndex: "storeName",
    },
    {
      title: "編集",
      dataIndex: "edit",
      width: 70,
      render: function renderEditIcon(_, record) {
        return dataSource.length >= 1 ? (
          <div onClick={() => editAccount(record.key)} style={customStyles}>
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
  const accountList = useSelector(
    (state) => state.accountMasterReducer.accountList
  );

  // useState
  const [dataSource, setDataSource] = useState([]);
  const [fullDataSource, setFullDataSource] = useState([]);

  useEffect(() => {
    if (!accountList.data) {
      dispatch(fetchAllAccountList());
    }
    dispatch(setLoading(true));
    dispatch(setIsCreatedAccount(false));
  }, []);

  useEffect(() => {
    if (accountList.data) {
      const formattedData = formatData(accountList.data.data);
      setDataSource(formattedData);
      setFullDataSource(formattedData);
      dispatch(setAllAccountList(null, true));
      dispatch(setIsCreatedAccount(false));
    }
  }, [accountList]);

  function formatData(data) {
    const newData = [];
    data.forEach((row, index) => {
      newData.push({
        key: row.userName,
        name: row.name,
        storeName: row.storeName,
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
        "削除したアカウントはもとに戻せません。アカウントを削除してもよろしいですか？ ",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(setLoading(true));
        dispatch(deleteAccount(record.key));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const addNew = () => {
    history.push("/settings/account-master/create");
  };
  const editAccount = (val) => {
    const decodedId = btoa(val);
    history.push(`/settings/account-master/edit/${decodedId}`);
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
        accountId: row.key,
        displayOrder: index + 1,
      });
    });
    // setIsLoading(true);
    dispatch(setLoading(true));
    dispatch(reOrderAccounts(reOrderedData));
  };

  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"アカウントマスタ"}
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
              emptyText={"該当するアカウントはありません。"}
              placeholder={"アカウントを検索"}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
