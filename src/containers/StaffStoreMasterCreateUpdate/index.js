import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { Row, Col, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import FormHeader from "components/FormHeader/index";
import Layout from "containers/Layout";
import DataSidePreview from "components/DataSidePreview";
import SettingsIcon from "components/Icons/SettingsIcon";
import StaffStoreForm from "components/Form/StaffStoreForm";
import _ from "lodash";
import auth from "utils/auth";
import { setError } from "actions/common";
import {
  createStaffStore,
  deleteStaffStore,
  fetchStaffStoreDetailsById,
  setIsCreatedStaffStore,
  setLoadedStaffStoreDetails,
  updateStaffStore,
} from "actions/staffStore";

const { confirm } = Modal;

export default function StaffStoreMasterCreateUpdate() {
  const history = useHistory();
  const dispatch = useDispatch();
  const methods = useForm({
    mode: "onChange",
  });

  const { handleSubmit, getValues, setValue, control } = methods;
  const role = auth.getKey("loginUser.role");

  const [isEdit, setIsEdit] = useState(false);
  const [loadedStaffStoreId, setLoadedStaffStoreId] = useState(null);
  const [loadedStoreId, setLoadedStoreId] = useState(null);
  const [loadedStoreName, setLoadedStoreName] = useState(null);
  const { id } = useParams();

  const created = useSelector(
    (state) => state.staffStoreCreateUpdateReducer.isCreatedStaffStore
  );
  const stores = useSelector((state) => state.layoutReducer.stores);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const loadedStaffStoreDetails = useSelector(
    (state) => state.staffStoreCreateUpdateReducer.loadedStaffStoreDetails
  );

  // execute start of render
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      dispatch(fetchStaffStoreDetailsById(id));
    }
  }, []);

  useEffect(() => {
    if (loadedStaffStoreDetails) {
      setValue("name", loadedStaffStoreDetails.name);
      setValue("isDisplayed", loadedStaffStoreDetails.isDisplayed.toString());
      setValue("stores", loadedStaffStoreDetails.storeId);
      setLoadedStaffStoreId(loadedStaffStoreDetails.id);
      setLoadedStoreId(loadedStaffStoreDetails.storeId);
    }
  }, [loadedStaffStoreDetails]);

  useEffect(() => {
    if (created) {
      history.push("/settings/staff-store-master");
      dispatch(setIsCreatedStaffStore(false));
    }
  }, [created]);

  useEffect(() => {
    if (stores && loadedStaffStoreDetails) {
      setLoadedStoreName(handleStoreSelection(loadedStaffStoreDetails.storeId));
      dispatch(setLoadedStaffStoreDetails(null));
    }
  }, [stores]);

  // methods
  const handleStoreSelection = (id) => {
    const selected = stores.filter((s) => s.id === id);
    return selected[0].name;
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
          history.push("/settings/staff-store-master");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      history.push("/settings/staff-store-master");
    }
  };
  const deleteStaffStoreById = () => {
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
        dispatch(setLoadedStaffStoreDetails(null));
        dispatch(deleteStaffStore(id, selectedStore.id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onUpdate = (data) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content: "更新します。よろしいですか？",
      okText: "はい",
      okType: "primary",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        data.id = loadedStaffStoreId;
        data.storeId = loadedStoreId;
        onSubmit(data);
      },
      onCancel() {
        return false;
      },
    });
  };
  const onSubmit = (data) => {
    if (data.name === "") {
      dispatch(setError("担当者名を入力してください。"));
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
    id ? dispatch(updateStaffStore(data)) : dispatch(createStaffStore(data));
  };
  const dataPreview = [
    {
      heading: "担当者",
      items: [
        {
          label: "担当者名",
          value: (watcher) => {
            const v = watcher.name ? `${watcher.name}` : "";
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
          label: "表示設定",
          value: (watcher) => {
            const v =
              watcher.isDisplayed && watcher.isDisplayed === "false"
                ? "非表示"
                : "表示";
            return v || "";
          },
        },
      ],
    },
  ];
  return (
    <Layout>
      <form
        className="form-container"
        onSubmit={!id ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}
      >
        <FormHeader
          title={!id ? "担当者の新規登録" : "担当者の編集"}
          icon={<SettingsIcon width={"28"} height={"28"} />}
        />
        <Row wrap={false}>
          <Col flex="auto">
            <StaffStoreForm
              control={control}
              stores={stores}
              role={role}
              selectedStore={selectedStore}
              loadedStoreId={loadedStoreId}
              loadedStoreName={loadedStoreName}
            />
          </Col>
          <DataSidePreview
            data={dataPreview}
            control={control}
            title={"担当者マスター"}
            submitButtonTitle={id ? "更新する" : "登録する"}
            onCancel={onCancelHandler}
            isEdit={isEdit}
            deleteHandler={deleteStaffStoreById}
          />
        </Row>
      </form>
    </Layout>
  );
}
