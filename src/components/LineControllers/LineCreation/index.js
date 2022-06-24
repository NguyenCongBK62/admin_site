import React from "react";
import { Row, Col } from "antd";
import PropTypes from "prop-types";
import LineButton from "../atoms/LineButton";

function LineCreation({ current, completeHandler }) {
  return (
    <div className="form-wrapper" style={{ paddingRight: "0px" }}>
      <Row className="form-section">
        <Col md={{ span: 20, offset: 2 }}>
          {current === 0 ? (
            <div className="input-element" style={{ textAlign: "center" }}>
              <p className="line-configuration-span">
                LINE公式アカウントをお持ちでない方はこちらから作成して、次のステップにお進みください。
              </p>
              <LineButton
                title="LINE公式アカウントを無料で作成"
                link="https://www.linebiz.com/jp/entry/"
                inputProps={{ style: { marginTop: "32px" } }}
              />
            </div>
          ) : (
            <div className="input-element" style={{ textAlign: "center" }}>
              <span className="line-configuration-span">
                各種正常に設定され、LINEと連携しました。
              </span>
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="primary"
                  className="button button-dark-blue button-primary-2"
                  style={{ marginTop: "16px" }}
                  onClick={completeHandler}
                >
                  完了する
                </button>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

LineCreation.propTypes = {
  current: PropTypes.number,
  completeHandler: PropTypes.func,
};

export default LineCreation;
