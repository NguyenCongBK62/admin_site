import React, { useState } from "react";
import { Checkbox, Col, Row } from "antd";
import Layout from "containers/Layout";
import { setError } from "actions/common";
import FormHeader from "components/FormHeader";
import GourmetIcon from "components/Icons/GourmetIcon";
import "./style/index.less";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
export default function EmailConfigurationConfirm() {
  const [check, setCheck] = useState(false);
  const history = useHistory();
  const hostMailConfigType = useSelector(
    (state) => state.emailConfigReducer.hostMailConfigType
  );
  const dispatch = useDispatch();
  const onChange = (e) => {
    setCheck(e.target.checked);
  };
  const handleClick = () => {
    if (check) {
      if (hostMailConfigType === "gnavi") {
        history.push("/email-configuration/gnavi-mail-configuration");
      }
      if (hostMailConfigType === "tabelog") {
        history.push("/email-configuration/tabelog-mail-configuration");
      }
      if (hostMailConfigType === "hotpepper") {
        history.push("/email-configuration/hotpepper-mail-configuration");
      }
    } else {
      dispatch(setError("注意事項に同意をお願い致します。"));
    }
  };
  return (
    <Layout>
      <div className="list-container">
        <Row>
          <FormHeader
            title={`メール取込設定`}
            icon={<GourmetIcon width="28" height="28" />}
          />
        </Row>
        <div className="table-mail-config-container">
          <Row justify="center">
            <Col span={18}>
              <div className="confirm-heading">
                メール取込の利用に関する注意事項
              </div>
            </Col>
          </Row>
          <Row justify="center" style={{ margin: "1rem auto" }}>
            <Col span={18}>
              <div className="confirm-heading">
                以下の注意事項をご了承の上、ご利用いただきますようお願い申し上げます。
              </div>
            </Col>
          </Row>
          <Row justify="center" style={{ margin: "1rem auto" }}>
            <Col span={18}>
              <ul className="list-confirm-details">
                <li>
                  本機能は、グルメサイトの予約通知メールを取込、予約登録の作業を補助する機能です。メールに記載のない情報はUMaTへ連携されませんので、各グルメサイトの管理画面でご確認ください。
                </li>
                <li>
                  グルメサイトの仕様変更等の理由により正常に動作しない場合がございます。
                </li>
                <li>
                  正常に動作しない場合は、各グルメサイトの管理画面をご確認いただき、お客様ご自身で予約登録をしてください。
                </li>
                <li>
                  対応しているグルメサイトは、「食べログ」「ホットペッパー」「ぐるなび」です。
                </li>
              </ul>
            </Col>
          </Row>
          <Row justify="center">
            <Checkbox style={{ fontSize: "14px" }} onChange={onChange}>
              上記の内容に同意します。
            </Checkbox>
          </Row>
          <Row justify="center" style={{ marginTop: "1rem", fontSize: "14px" }}>
            <button
              type="primary"
              className="button button-dark-blue button-primary-2"
              onClick={handleClick}
            >
              設定を行う
            </button>
          </Row>
        </div>
      </div>
    </Layout>
  );
}
