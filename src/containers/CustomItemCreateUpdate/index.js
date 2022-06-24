import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import FormHeader from "components/FormHeader/index";
import Layout from "containers/Layout";
import DataSidePreview from "components/DataSidePreview";
import SettingsIcon from "components/Icons/SettingsIcon";
import CustomItemForm from "components/Form/CustomItemForm";
import { setError } from "actions/common";

import {
  createCustomItems,
  deleteCustomItem,
  fetchCustomItemsDetails,
  setIsCreatedItems,
  setLoadedItemsDetails,
  updateCustomItems,
} from "actions/customItemsAction";

const { confirm } = Modal;

const typeOption = [
  { id: "", name: "タイプを選択してください" },
  { id: "1", name: "文字入力（一行）" },
  { id: "6", name: "文字入力（複数行）" },
  { id: "2", name: "数字入力" },
  { id: "3", name: "選択項目（１つだけ選択可能）" },
  { id: "4", name: "選択項目（複数回答可能）" },
  { id: "5", name: "日付" },
];

export default function CustomItemCreateUpdate() {
  const methods = useForm({
    mode: "onChange",
  });
  const { handleSubmit, control, setValue, watch } = methods;
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const encodedId = id ? atob(id) : id;
  const [isEdit, setIsEdit] = useState(false);
  const [originalOption, setOriginalOption] = useState([]);

  const [loadedItemId, setLoadedItemId] = useState(null);
  const stores = useSelector((state) => state.layoutReducer.stores);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const created = useSelector(
    (state) => state.customItemCreateUpdateReducer.isCreatedItems
  );
  const loadeditemDetails = useSelector(
    (state) => state.customItemCreateUpdateReducer.loadeditemDetails
  );

  // execute start of render
  useEffect(() => {
    if (encodedId) {
      setIsEdit(true);
      if (!loadeditemDetails) {
        dispatch(fetchCustomItemsDetails(encodedId));
      }
    }
  }, []);

  useEffect(() => {
    console.log("loadeditemDetails ", loadeditemDetails);
    if (encodedId && loadeditemDetails) {
      setOriginalOption(loadeditemDetails.option);
      setValue("name", loadeditemDetails.name);
      setValue("typeId", loadeditemDetails.type?.id.toString());
      let textOptions = "";
      loadeditemDetails.option.forEach((item) => {
        textOptions += item.name + "\n";
      });
      setValue("selectOptions", textOptions);
      setValue("selectMultipleOptions", textOptions);
      if (
        loadeditemDetails.attribute.length &&
        loadeditemDetails.attribute[0]?.name === "row"
      ) {
        setValue("optTextarea", loadeditemDetails.attribute[0]?.value);
      }
      setValue("unit", loadeditemDetails.unit);
      setValue("required", loadeditemDetails.required);
      setValue("displayOnReservation", loadeditemDetails.displayOnReservation);
      setValue("displayOnCustomer", loadeditemDetails.displayOnCustomer);
      setLoadedItemId(loadeditemDetails.id);
      dispatch(setLoadedItemsDetails(null));
    }
  }, [loadeditemDetails]);

  useEffect(() => {
    if (created) {
      dispatch(setIsCreatedItems(false));
      history.push("/customer/custom-item/list");
    }
  }, [created]);

  const onCancelHandler = () => {
    if (encodedId) {
      confirm({
        icon: <ExclamationCircleOutlined />,
        title: "確認",
        content: "編集した内容は破棄されます。よろしいですか？",
        okText: "はい",
        okType: "danger",
        cancelText: "いいえ",
        centered: true,
        onOk() {
          history.push("/customer/custom-item/list");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      history.push("/customer/custom-item/list");
    }
  };

  const deleteItemById = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したカスタム項目はもとに戻せません。 カスタム項目を削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(deleteCustomItem(encodedId, selectedStore.id));
        history.push("/customer/custom-item/list");
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
        data.id = loadedItemId;
        onSubmit(data);
      },
      onCancel() {
        return false;
      },
    });
  };

  const onRegister = (data) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content: "登録します。よろしいですか？",
      okText: "はい",
      okType: "primary",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        onSubmit(data);
      },
      onCancel() {
        return false;
      },
    });
  };

  const onSubmit = (data) => {
    if (data.name === "" || data.name === undefined) {
      dispatch(setError("項目名を入力してください。"));
      return false;
    }
    if (data.typeId === "" || data.typeId === undefined) {
      dispatch(setError("タイプを選択してください。"));
      return false;
    }
    if (
      data.typeId === "3" &&
      (data.selectOptions === "" || data.selectOptions === undefined)
    ) {
      dispatch(setError("選択項目を入力してください。"));
      return false;
    }
    if (
      data.typeId === "4" &&
      (data.selectMultipleOptions === "" ||
        data.selectMultipleOptions === undefined)
    ) {
      dispatch(setError("選択項目を入力してください。"));
      return false;
    }
    if (data.typeId === "6" && data.optTextarea <= 0) {
      dispatch(setError("行数は数字1-20以内で入力してください。"));
      return false;
    }
    if (data.typeId === "6" && data.optTextarea > 20) {
      dispatch(setError("行数は数字1-20以内で入力してください。"));
      return false;
    }

    const newData = {
      option: [],
      type: {},
      attribute: [],
    };

    newData.type = typeOption.filter((item) => item.id === data.typeId)[0];
    if (data.unit) {
      newData.unit = data.unit;
    } else {
      newData.unit = "";
    }
    if (data.typeId === "6") {
      newData.attribute.push({
        value: data.optTextarea,
        name: "row",
      });
    }
    if (data.typeId === "3") {
      const textOptions = data.selectOptions.trim().split(/\r\n|\n|\r/);
      if (textOptions === "" || textOptions === undefined) {
        dispatch(setError("選択項目を入力してください。"));
        return false;
      }
      textOptions.forEach((val, i) => {
        if (val.trim() !== "") {
          newData.option.push({
            name: val.trim(),
            id: originalOption[i] !== undefined ? originalOption[i].id : null,
          });
          // newData.option.push({ name: val.trim() });
        }
      });
    }
    if (data.typeId === "4") {
      const textOptions = data.selectMultipleOptions.trim().split(/\r\n|\n|\r/);
      if (textOptions === "" || textOptions === undefined) {
        dispatch(setError("選択項目を入力してください。"));
        return false;
      }
      textOptions.forEach((val, i) => {
        if (val.trim() !== "") {
          newData.option.push({
            name: val.trim(),
            id: originalOption[i] !== undefined ? originalOption[i].id : null,
          });
          // newData.option.push({ name: val.trim() });
        }
      });
    }
    newData.storeId = selectedStore.id;
    newData.id = data.id;
    newData.name = data.name;
    newData.displayOnReservation = data.displayOnReservation;
    newData.displayOnCustomer = data.displayOnCustomer;
    newData.required = data.required;
    console.log("newData ", newData);
    encodedId
      ? dispatch(updateCustomItems(newData))
      : dispatch(createCustomItems(newData));
  };

  const dataPreview = [
    {
      heading: "カスタム項目",
      items: [
        {
          label: "項目名",
          value: (watcher) => {
            const v = watcher.name ? `${watcher.name}` : "";
            return v || "";
          },
        },
        {
          label: "タイプ",
          value: (watcher) => {
            const v = watcher.typeId
              ? handleTypeSelection(watcher.typeId.toString())
              : "";
            return v || "";
          },
        },
        {
          label: "単位：",
          value: (watcher) => {
            const v = watcher.unit ? `${watcher.unit}` : "";
            return v || "";
          },
          show: watch("typeId") === "2",
        },
        {
          label: "行数",
          value: (watcher) => {
            const v = watcher.optTextarea ? `${watcher.optTextarea}` : "";
            return v || "";
          },
          show: watch("typeId") === "6",
        },
        {
          label: "選択値：",
          value: (watcher) => {
            const v = watcher.selectOptions ? `${watcher.selectOptions}` : "";
            return v || "";
          },
          show: watch("typeId") === "3",
        },
        {
          label: "選択値：",
          value: (watcher) => {
            const v = watcher.selectMultipleOptions
              ? `${watcher.selectMultipleOptions}`
              : "";
            return v || "";
          },
          show: watch("typeId") === "4",
        },
        {
          label: "必須項目にする",
          value: (watcher) => {
            let v = "";
            if (watcher.required === true) {
              v = "必須";
            }
            if (watcher.required === false) {
              v = "任意";
            }
            return v || "";
          },
        },
        {
          label: "予約画面に表示する",
          value: (watcher) => {
            let v = "";
            if (watcher.displayOnReservation === true) {
              v = "する";
            }
            if (watcher.displayOnReservation === false) {
              v = "しない";
            }
            return v || "";
          },
        },
        {
          label: "お客様情報画面に表示する",
          value: (watcher) => {
            let v = "";
            if (watcher.displayOnCustomer === true) {
              v = "する";
            }
            if (watcher.displayOnCustomer === false) {
              v = "しない";
            }
            return v || "";
          },
        },
      ],
    },
  ];

  const handleTypeSelection = (id) => {
    const selected = typeOption.filter((s) => s.id === id.toString());

    return selected[0].name;
  };

  const typeId = watch("typeId");

  return (
    <Layout>
      <form
        className="form-container"
        onSubmit={
          !encodedId ? handleSubmit(onRegister) : handleSubmit(onUpdate)
        }
      >
        <FormHeader
          title={"カスタム項目の新規登録"}
          icon={<SettingsIcon width={"28"} height={"28"} type={"lg"} />}
        />
        <Row wrap={false}>
          <Col flex="auto">
            <CustomItemForm
              control={control}
              stores={stores}
              handleTypeSelection={handleTypeSelection}
              typeOption={typeOption}
              typeId={typeId}
            />
          </Col>
          <DataSidePreview
            data={dataPreview}
            control={control}
            title={"カスタム項目設定"}
            submitButtonTitle={encodedId ? "更新する" : "登録する"}
            isEdit={isEdit}
            onCancel={onCancelHandler}
            deleteHandler={deleteItemById}
          />
        </Row>
      </form>
    </Layout>
  );
}
