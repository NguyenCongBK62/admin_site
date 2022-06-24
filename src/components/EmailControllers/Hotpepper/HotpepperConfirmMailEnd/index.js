import { Checkbox, Col, Row } from "antd";
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style/index.less";

function HotpepperConFirmMailEnd({ oncheckEnd1, oncheckEnd2, oncheckEnd3 }) {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const onChange1 = (e) => {
    setCheck1(e.target.checked);
    oncheckEnd1(check1);
  };
  const onChange2 = (e) => {
    setCheck2(e.target.checked);
    oncheckEnd2(check2);
  };
  const onChange3 = (e) => {
    setCheck3(e.target.checked);
    oncheckEnd3(check3);
  };
  return (
    <div className="form-wrapper" style={{ paddingRight: "0px" }}>
      <Row className="form-section">
        <Col md={{ span: 22, offset: 2 }}>
          <div className="registration-email-title">
            <span>
              全ての作業が終わりましたらチェックを入れて完了ボタンを押してください。
            </span>
          </div>
          <Col md={{ span: 19, offset: 5 }}>
            <Row justify="start" style={{ margin: "1rem 0" }}>
              <Checkbox style={{ fontSize: "14px" }} onChange={onChange1}>
                ステップ1.
                ホットペッパー管理画面に取込専用メールアドレスを登録しました。
              </Checkbox>
            </Row>
            <Row justify="start" style={{ margin: "1rem 0" }}>
              <Checkbox style={{ fontSize: "14px" }} onChange={onChange2}>
                ステップ2.
                認証URLをクリックし、メールアドレスの認証を完了しました。
              </Checkbox>
            </Row>
            <Row justify="start" style={{ margin: "1rem 0" }}>
              <Checkbox style={{ fontSize: "14px" }} onChange={onChange3}>
                ステップ3.
                ホットペッパー管理画面にて「予約個別通知」にチェックを入れ設定を完了しました。
              </Checkbox>
            </Row>
          </Col>
          <Row justify="center" style={{ margin: "2rem 0 0 1rem" }}>
            <p className="footer-config-hotpepper-end">
              ※UMaTの店舗マスタ・メニューマスタ・テーブルマスタの
              登録画面にある「グルメサイト連携情報」の設定も行ってください。
            </p>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
HotpepperConFirmMailEnd.propTypes = {
  oncheckEnd1: PropTypes.func,
  oncheckEnd2: PropTypes.func,
  oncheckEnd3: PropTypes.func,
};

export default HotpepperConFirmMailEnd;
