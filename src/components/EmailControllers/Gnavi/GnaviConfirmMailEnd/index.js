import { Checkbox, Col, Row } from "antd";
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style/index.less";

function GnaviConFirmMailEnd({ oncheckEnd1, oncheckEnd2 }) {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const onChange1 = (e) => {
    setCheck1(e.target.checked);
    oncheckEnd1(check1);
  };
  const onChange2 = (e) => {
    setCheck2(e.target.checked);
    oncheckEnd2(check2);
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

          <Row justify="center" style={{ margin: "1rem 0" }}>
            <Checkbox style={{ fontSize: "14px" }} onChange={onChange1}>
              ステップ1.
              ぐるなび管理画面に取込専用メールアドレスを登録しました。
            </Checkbox>
          </Row>
          <Row justify="center" style={{ margin: "1rem 0" }}>
            <Checkbox style={{ fontSize: "14px" }} onChange={onChange2}>
              ステップ2.
              ぐるなび管理画面にてメールアドレスの認証を完了しました。
            </Checkbox>
          </Row>
          <Row justify="center" style={{ margin: "2rem 0 1rem 0" }}>
            <p className="footer-config-gnavi-end">
              ※UMaTの店舗マスタ・メニューマスタ・テーブルマスタの
              登録画面にある「グルメサイト連携情報」の設定も行ってください。
            </p>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
GnaviConFirmMailEnd.propTypes = {
  oncheckEnd1: PropTypes.func,
  oncheckEnd2: PropTypes.func,
};

export default GnaviConFirmMailEnd;
