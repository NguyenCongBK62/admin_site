import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Modal } from "antd";

import FormHeader from "components/FormHeader/index";
import Layout from "containers/Layout";
import DataSidePreview from "components/DataSidePreview";
import SettingsIcon from "components/Icons/SettingsIcon";
import AccountMasterForm from "components/Form/AccountMasterForm";
import { useDispatch, useSelector } from "react-redux";
import auth from "utils/auth";
import { setError, setLoading } from "actions/common";
import {
  createAccountUser,
  deleteAccount,
  fetchAccountDetailsByUserId,
  setIsCreatedAccount,
  setLoadedAccountDetails,
  updateAccountUser,
} from "actions/account";
import { useHistory, useParams } from "react-router";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

export default function AccountMasterCreateUpdate() {
  const history = useHistory();
  const dispatch = useDispatch();
  const methods = useForm({
    mode: "onChange",
  });

  const { handleSubmit, getValues, setValue, control } = methods;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [loadedAccountId, setLoadedAccountId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const indentificationCode = auth.getKey("loginUser.indentificationCode");
  const { id } = useParams();
  const encodedId = id ? atob(id) : id;

  const created = useSelector(
    (state) => state.accountMasterCreateUpdateReducer.isCreatedAccount
  );
  const stores = useSelector((state) => state.layoutReducer.stores);
  const loadedAccountDetails = useSelector(
    (state) => state.accountMasterCreateUpdateReducer.loadedAccountDetails
  );

  // execute start of render
  useEffect(() => {
    if (encodedId) {
      setIsEdit(true);
      dispatch(setLoading(true));
      if (!loadedAccountDetails) {
        dispatch(fetchAccountDetailsByUserId(encodedId));
      }
    }
  }, []);

  useEffect(() => {
    if (encodedId && loadedAccountDetails) {
      setValue("name", loadedAccountDetails.name);
      const strName = loadedAccountDetails.userName;
      setUserId(strName);
      const posBeginCode = loadedAccountDetails.userName.indexOf("@");
      setValue("userName", strName.substr(0, posBeginCode));
      setValue("password", loadedAccountDetails.password);
      setLoadedAccountId(loadedAccountDetails.id);
    }
  }, [loadedAccountDetails]);

  useEffect(() => {
    if (created) {
      history.push("/settings/account-master");
      dispatch(setIsCreatedAccount(false));
    }
  }, [created]);

  useEffect(() => {
    if (encodedId && stores && loadedAccountDetails) {
      setValue("storeId", loadedAccountDetails.storeId);
      dispatch(setLoadedAccountDetails(null));
    }
  }, [stores]);

  // methods
  const handleUserId = (v) => {
    if (v.target.value.length > 0) {
      setUserId(v.target.value + indentificationCode);
    } else {
      setUserId("");
    }
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    setPassword(getValues("password"));
  };
  const handleStoreSelection = (id) => {
    const selected = stores.filter((s) => s.id === id);
    return selected[0].name;
  };
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
          history.push("/settings/account-master");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      history.push("/settings/account-master");
    }
  };
  const deleteAccountById = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したアカウントはもとに戻せません。アカウントを削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(setLoadedAccountDetails(null));
        dispatch(setLoading(true));
        dispatch(deleteAccount(encodedId));
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
        data.id = loadedAccountId;
        onSubmit(data);
      },
      onCancel() {
        return false;
      },
    });
  };
  const onSubmit = (data) => {
    if (data.name === "" || data.name === undefined) {
      dispatch(setError("アカウント名を入力してください。"));
      return false;
    }
    if (data.userName === "" || data.userName === undefined) {
      dispatch(setError("ユーザーIDを入力してください"));
      return false;
    }
    if (data.userName.match(/^[A-Za-z0-9]{0,255}$/) == null) {
      dispatch(setError("ユーザーIDは半角英数字で入力してください。"));
      return false;
    }
    if (data.password === "" || data.password === undefined) {
      dispatch(setError("パスワードは半角英数字8文字以上で入力してください。"));
      return false;
    }
    if (data.password.match(/^[A-Za-z0-9]{8,255}$/) == null) {
      dispatch(setError("パスワードは半角英数字8文字以上で入力してください。"));
      return false;
    }
    if (data.storeId === "" || data.storeId === undefined) {
      dispatch(setError("対象店舗を選択してください。"));
      return false;
    }
    dispatch(setLoading(true));
    encodedId
      ? dispatch(updateAccountUser(data))
      : dispatch(createAccountUser(data));
  };
  const dataPreview = [
    {
      heading: "アカウント",
      items: [
        {
          label: "アカウント名",
          value: (watcher) => {
            const v = watcher.name ? `${watcher.name}` : "";
            return v || "";
          },
        },
        {
          label: "ユーザーID",
          value: (watcher) => {
            const v = watcher.userName ? `${watcher.userName}` : "";
            return v || "";
          },
        },
        {
          label: "パスワード",
          value: (watcher) => {
            let v = "";
            if (watcher.password) {
              v = showPassword
                ? `${watcher.password}`
                : Array(watcher.password.length + 1).join("•");
            }
            return v || "";
          },
        },
        {
          label: "対象店舗",
          value: (watcher) => {
            const v = watcher.storeId
              ? handleStoreSelection(watcher.storeId)
              : "";
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
        onSubmit={!encodedId ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}
      >
        <FormHeader
          title={encodedId ? "アカウントの編集" : "アカウントの新規登録"}
          icon={<SettingsIcon width={"28"} height={"28"} type={"lg"} />}
        />
        <Row wrap={false}>
          <Col flex="auto">
            <AccountMasterForm
              control={control}
              stores={stores}
              handleShowPassword={handleShowPassword}
              showPassword={showPassword}
              password={password}
              userId={userId}
              handleUserId={handleUserId}
            />
          </Col>
          {/* <Col className="detail-view" flex="360px"> */}
          <DataSidePreview
            data={dataPreview}
            control={control}
            title={"アカウントマスタ"}
            submitButtonTitle={encodedId ? "更新する" : "登録する"}
            onCancel={onCancelHandler}
            isEdit={isEdit}
            deleteHandler={deleteAccountById}
          />
          {/* </Col> */}
        </Row>
      </form>
    </Layout>
  );
}
