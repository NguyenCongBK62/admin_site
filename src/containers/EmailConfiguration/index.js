import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  deleteMailConfig,
  fetchAllMailConfig,
  setHostMailConfigType,
} from "actions/emailConfig";
import { resetCreateGnaviSuccess } from "actions/gnaviMailConfig";
import { resetCreateHotpepperSuccess } from "actions/hotpepperMailConfig";
import { resetCreateTabelogSuccess } from "actions/tabelogMailConfig";
import { Col, Modal, Row } from "antd";
import FormHeader from "components/FormHeader";
import EditIcon from "components/Icons/EditIcon";
import GourmetIcon from "components/Icons/GourmetIcon";
import TrashIcon from "components/Icons/TrashIcon";
import Layout from "containers/Layout";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import auth from "utils/auth";
import "./style/index.less";

const { confirm } = Modal;
dayjs.extend(utc);
dayjs.extend(timezone);

export default function EmailConfiguration() {
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const storeList = useSelector((state) => state.layoutReducer.stores);
  const allMailStatus = useSelector(
    (state) => state.emailConfigReducer.hostMailConfigStatus
  );

  const customStyles = {
    cursor: "pointer",
  };

  useEffect(() => {
    dispatch(resetCreateGnaviSuccess());
    dispatch(resetCreateTabelogSuccess());
    dispatch(resetCreateHotpepperSuccess());
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllMailConfig(
        `${auth.getKey("loginUser.companyCode")}`,
        `${auth.getKey("loginUser.storeId")}`
      )
    );
  }, [auth.getKey("loginUser.storeId")]);

  const showConfirm = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content: "再設定を行いますか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        if (record.key === "ホットペッパー") {
          dispatch(setHostMailConfigType("hotpepper"));
          dispatch(
            deleteMailConfig({
              companyCode: `${auth.getKey("loginUser.companyCode")}`,
              storeId: `${auth.getKey("loginUser.storeId")}`,
              type: "hotpepper",
            })
          );
          history.push("/email-configuration/confirm");
        }
        if (record.key === "食べログ") {
          dispatch(setHostMailConfigType("tabelog"));
          dispatch(
            deleteMailConfig({
              companyCode: `${auth.getKey("loginUser.companyCode")}`,
              storeId: `${auth.getKey("loginUser.storeId")}`,
              type: "tabelog",
            })
          );
          history.push("/email-configuration/confirm");
        }
        if (record.key === "ぐるなび") {
          dispatch(setHostMailConfigType("gnavi"));
          dispatch(
            deleteMailConfig({
              companyCode: `${auth.getKey("loginUser.companyCode")}`,
              storeId: `${auth.getKey("loginUser.storeId")}`,
              type: "gnavi",
            })
          );
          history.push("/email-configuration/confirm");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onEdit = (record) => {
    if (record.key === "ホットペッパー") {
      dispatch(setHostMailConfigType("hotpepper"));
      history.push("/email-configuration/confirm");
    }
    if (record.key === "食べログ") {
      dispatch(setHostMailConfigType("tabelog"));
      history.push("/email-configuration/confirm");
    }
    if (record.key === "ぐるなび") {
      dispatch(setHostMailConfigType("gnavi"));
      history.push("/email-configuration/confirm");
    }
  };
  const sizeWidth = ["25%", "25%", "25%", "25%"];
  const headerTable = ["グルメサイト", "状態", "設定完了時間", ""];

  const datas = [
    {
      key: "ホットペッパー",
      host: "ホットペッパー",
      status:
        allMailStatus && allMailStatus.hotpepperFlag ? "設定済" : "未設定",
      configDate:
        allMailStatus && allMailStatus.hotpepperFlag
          ? dayjs(allMailStatus.hotpepperDate)
              .tz("Asia/Tokyo")
              .format("YYYY-MM-DD HH:mm")
          : "----/--/-- --:--",
    },
    {
      key: "食べログ",
      host: "食べログ",
      status: allMailStatus && allMailStatus.tabelogFlag ? "設定済" : "未設定",
      configDate:
        allMailStatus && allMailStatus.tabelogFlag
          ? dayjs(allMailStatus.tabelogDate)
              .tz("Asia/Tokyo")
              .format("YYYY-MM-DD HH:mm")
          : "----/--/-- --:--",
    },
    {
      key: "ぐるなび",
      host: "ぐるなび",
      status: allMailStatus && allMailStatus.gnaviFlag ? "設定済" : "未設定",
      configDate:
        allMailStatus && allMailStatus.gnaviFlag
          ? dayjs(allMailStatus.gnaviDate)
              .tz("Asia/Tokyo")
              .format("YYYY-MM-DD HH:mm")
          : "----/--/-- --:--",
    },
  ];

  return (
    <Layout>
      <div className="mail-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={`グルメサイト連携 ${selectedStore.name}`}
            icon={<GourmetIcon width="28" height="28" />}
          />
        </Row>
        <div className="table-mail-container">
          <Row
            style={{ marginTop: "1rem", width: "100%", marginBottom: "2rem" }}
            justify="center"
          >
            <div className="company-code-mail">
              <span>
                取込専用メールアドレス ： reserve-
                {auth.getKey("loginUser.companyCode")
                  ? auth.getKey("loginUser.companyCode")
                  : ""}
                @umat-operation.com
              </span>
            </div>
          </Row>
          <Row justify="center" style={{ width: "80%", margin: "0 auto" }}>
            <span>
              この先の設定手順ではグルメサイト管理画面のID・パスワードが必要となりますのでお手元にご準備ください。
            </span>
          </Row>
          <Row
            className="table-div"
            style={{ marginTop: "2rem" }}
            justify="center"
          >
            <Col
              className="table-div-content"
              span={18}
              xs={24}
              style={{ margin: "0 auto" }}
            >
              <div className="table-mail">
                <div className="table-mail__header">
                  {headerTable.map((head, keyHead) => {
                    return (
                      <div
                        key={keyHead}
                        className="header-item"
                        style={{ width: sizeWidth[keyHead] }}
                      >
                        {head}
                      </div>
                    );
                  })}
                </div>
                <div className="table-mail__body">
                  {datas.map(function (data) {
                    return (
                      <div key={data.key}>
                        <div className="row-mail">
                          <div style={{ width: "25%", paddingLeft: 20 }}>
                            {data.host}
                          </div>
                          <div
                            className={
                              data.status === "設定済"
                                ? "configured item-data"
                                : "not-configured-yet item-data"
                            }
                            style={{ width: "25%" }}
                          >
                            {data.status}
                          </div>
                          <div
                            className={
                              data.status === "設定済"
                                ? "configured item-data"
                                : "not-configured-yet item-data"
                            }
                            style={{ width: "25%" }}
                          >
                            {data.configDate}
                          </div>
                          <div
                            className={
                              data.status === "設定済"
                                ? "configured item-data"
                                : "not-configured-yet item-data"
                            }
                            style={{ width: "25%" }}
                          >
                            {storeList.length === 0 ? (
                              <div> </div>
                            ) : data.status === "設定済" ? (
                              <button
                                onClick={() => showConfirm(data)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "0",
                                }}
                                disabled={storeList.length === 0}
                              >
                                <TrashIcon customStyles={customStyles} />
                              </button>
                            ) : (
                              <button
                                onClick={() => onEdit(data)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "0",
                                }}
                                disabled={storeList.length === 0}
                              >
                                <EditIcon customStyles={customStyles} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
}
