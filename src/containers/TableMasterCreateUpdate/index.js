import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { Row, Col, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import FormHeader from "components/FormHeader/index";
import DataSidePreview from "components/DataSidePreview";
import SettingsIcon from "components/Icons/SettingsIcon";
import TableMasterForm from "components/Form/TableMasterForm";
import Layout from "containers/Layout";

import { setError } from "actions/common";
import {
  createTable,
  deleteTable,
  fetchTableDetailsById,
  setIsCreatedTable,
  setLoadedTableDetails,
  updateTable,
} from "actions/table";

import _ from "lodash";
import auth from "utils/auth";

const { confirm } = Modal;

const smokeOption = [
  { id: "", name: "選択してください" },
  { id: "0", name: "禁煙" },
  { id: "1", name: "喫煙" },
  { id: "2", name: "喫煙（加熱式たばこ限定）" },
];

export default function TableMasterCreateUpdate() {
  const history = useHistory();
  const dispatch = useDispatch();

  const methods = useForm({
    mode: "onChange",
  });
  const { handleSubmit, getValues, setValue, control } = methods;
  const role = auth.getKey("loginUser.role");

  const [isEdit, setIsEdit] = useState(false);
  const [loadedStoreId, setLoadedStoreId] = useState(null);
  const [loadedStoreName, setLoadedStoreName] = useState(null);
  const { id } = useParams();

  const created = useSelector(
    (state) => state.tableMasterCreateUpdateReducer.isCreatedTable
  );
  const stores = useSelector((state) => state.layoutReducer.stores);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const loadedTableDetails = useSelector(
    (state) => state.tableMasterCreateUpdateReducer.loadedTableDetails
  );

  // execute start of render
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      dispatch(setLoadedTableDetails(null));

      if (!loadedTableDetails) {
        dispatch(fetchTableDetailsById(id));
      }
    }
  }, []);

  useEffect(() => {
    if (id && loadedTableDetails) {
      setValue("name", loadedTableDetails.table.name);
      setValue("numberOfSeats", loadedTableDetails.table?.numberOfSeats);
      setValue("smokeStatus", loadedTableDetails.table.smokeStatus?.toString());
      setValue("note", loadedTableDetails.table.note?.toString());
      setValue(
        "displayStatus",
        loadedTableDetails.table.displayStatus.toString()
      );
      setValue("nameTaberogu", loadedTableDetails.table.nameTaberogu);
      setValue("nameGurunavi", loadedTableDetails.table.nameGurunavi);
      setValue("nameHotopepper", loadedTableDetails.table.nameHotopepper);
      setLoadedStoreId(loadedTableDetails.lstUsedStore[0]);
    }
  }, [loadedTableDetails]);

  useEffect(() => {
    if (created) {
      history.push("/settings/table-master");
      dispatch(setIsCreatedTable(false));
    }
  }, [created]);

  useEffect(() => {
    if (stores && loadedTableDetails) {
      setLoadedStoreName(
        handleStoreSelection(loadedTableDetails.lstUsedStore[0])
      );
      dispatch(setLoadedTableDetails(null));
    }
  }, [stores]);

  // methods
  const handleStoreSelection = (id) => {
    const selected = stores.filter((s) => s.id === id);
    return selected[0].name;
  };

  const handleSelectOption = (id) => {
    const selectedSmokeOption = smokeOption.filter((s) => s.id === id);
    return selectedSmokeOption[0].name;
  };

  const onCancelHandler = () => {
    if (id) {
      confirm({
        icon: <ExclamationCircleOutlined />,
        title: "確認",
        content: "編集した内容は破棄されます。よろしいですか？",
        okText: "はい",
        okType: "danger",
        cancelText: "いいえ",
        centered: true,
        onOk() {
          history.push("/settings/table-master");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      history.push("/settings/table-master");
    }
  };

  const deleteTableById = () => {
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
        dispatch(setLoadedTableDetails(null));
        dispatch(deleteTable(id, selectedStore.id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onSubmit = (data) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content: id
        ? "更新します。よろしいですか？"
        : "登録します。よろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        if (data.name === "") {
          dispatch(setError("テーブル名を入力してください"));
          return false;
        }
        const checkboxStores = [];
        if (role === "admin") {
          if (!loadedStoreId) {
            const stores = getValues("stores");
            stores.forEach((item) => {
              if (item.id !== -2) checkboxStores.push(item.id);
            });
          } else {
            checkboxStores.push(loadedStoreId);
          }
        } else if (role === "user") {
          checkboxStores.push(selectedStore.id);
        }
        if (checkboxStores.length === 0) {
          dispatch(setError("対象店舗を選択してください。"));
          return false;
        }
        data.stores = id ? [] : checkboxStores;
        data.numberOfSeats = data.numberOfSeats ? data.numberOfSeats : 0;
        data.smokeStatus = data.smokeStatus ? data.smokeStatus : "";
        data.note = data.note ? data.note.trim() : "";
        data.storeId = selectedStore.id;
        if (id) {
          data.id = id;
          dispatch(updateTable(data));
        } else {
          dispatch(createTable(data));
        }
      },
      onCancel() {
        return false;
      },
    });
  };

  const dataPreview = [
    {
      heading: "テーブル",
      items: [
        {
          label: "テーブル名",
          value: (watcher) => {
            const v = watcher.name ? `${watcher.name}` : "";
            return v || "";
          },
        },
        {
          label: "人数",
          value: (watcher) => {
            const v = watcher.numberOfSeats ? `${watcher.numberOfSeats}` : "";
            return v || "";
          },
        },
        {
          label: "禁煙/喫煙:",
          value: (watcher) => {
            const v = watcher.smokeStatus
              ? handleSelectOption(watcher.smokeStatus.toString())
              : "";
            return v || "";
          },
        },
        {
          label: "対象店舗",
          value: (watcher) => {
            let v = "";
            if (role === "admin" && !loadedStoreId) {
              _.forEach(
                watcher.stores,
                (m) => (v += m.id !== -2 ? `${m.name}, ` : "")
              );
              return v.slice(0, -2) || "";
            } else if (loadedStoreId && stores.length > 0) {
              v = loadedStoreName;
              return v || "";
            } else {
              v = selectedStore ? selectedStore.name : "";
              return v || "";
            }
          },
        },
        {
          label: "メモ",
          value: (watcher) => {
            const v = watcher.note ? `${watcher.note}` : "";
            return v || "";
          },
        },
        {
          label: "表示設定",
          value: (watcher) => {
            const v =
              watcher.displayStatus && watcher.displayStatus === "false"
                ? "非表示"
                : "表示";
            return v || "";
          },
        },
      ],
    },
    {
      heading: "グルメサイト連携情報",
      items: [
        {
          label: "食べログ",
          value: (watcher) => {
            const v = watcher.nameTaberogu ? `${watcher.nameTaberogu} ` : "";
            return v || "";
          },
        },
        {
          label: "ぐるなび",
          value: (watcher) => {
            const v = watcher.nameGurunavi ? `${watcher.nameGurunavi} ` : "";
            return v || "";
          },
        },
        {
          label: "ホットペッパー",
          value: (watcher) => {
            const v = watcher.nameHotopepper
              ? `${watcher.nameHotopepper} `
              : "";
            return v || "";
          },
        },
      ],
    },
  ];
  return (
    <Layout>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={id ? "テーブルの編集" : "テーブルの新規登録"}
          icon={<SettingsIcon width={"28"} height={"28"} />}
        />
        <Row wrap={false}>
          <Col flex="auto">
            <TableMasterForm
              control={control}
              stores={stores}
              smokeOption={smokeOption}
              role={role}
              selectedStore={selectedStore}
              loadedStoreId={loadedStoreId}
              loadedStoreName={loadedStoreName}
            />
          </Col>
          <DataSidePreview
            data={dataPreview}
            control={control}
            title={"テーブルマスタ"}
            submitButtonTitle={id ? "更新する" : "登録する"}
            onCancel={onCancelHandler}
            isEdit={isEdit}
            deleteHandler={deleteTableById}
          />
        </Row>
      </form>
    </Layout>
  );
}
