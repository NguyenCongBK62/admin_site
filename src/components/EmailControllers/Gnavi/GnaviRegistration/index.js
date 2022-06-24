import { Col, Row, Tooltip } from "antd";
import QuestionMarkIcon from "components/Icons/QuestionMarkIcon";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { setSuccessMessage } from "actions/common";
import { useDispatch } from "react-redux";
import auth from "utils/auth";
import "./style/index.less";
import ExternalLinkIcon from "components/Icons/ExternalLinkIcon";
import CopyOutlined from "@ant-design/icons/CopyOutlined";
const secretTootlTipTitle =
  "「ぐるなび店舗管理画面」にログイン＞「予約管理」を選択＞「設定」＞「通知の送信先」からメールアドレスを登録してください。";
export default function GnaviRegistration() {
  const dispatch = useDispatch();
  return (
    <div className="form-wrapper" style={{ paddingRight: "0px" }}>
      <Row className="form-section">
        <Col md={{ span: 20, offset: 2 }}>
          <div className="registration-email-title">
            <span>
              ぐるなび管理画面にて取込専用メールアドレスを登録してください。
            </span>
          </div>
          <div className="mail-copy">
            <span>
              1. 取込専用メールアドレス「 reserve-
              {auth.getKey("loginUser.companyCode")
                ? auth.getKey("loginUser.companyCode")
                : ""}
              @umat-operation.com 」をコピーしてください。
            </span>
          </div>
          <Row justify="center">
            <div className="copy-clipboard">
              <CopyToClipboard
                text={
                  "reserve-" +
                  auth.getKey("loginUser.companyCode") +
                  "@umat-operation.com"
                }
              >
                <button
                  className="copy-button"
                  onClick={() =>
                    dispatch(
                      setSuccessMessage("メールアドレスをコピーしました。")
                    )
                  }
                >
                  <CopyOutlined style={{ marginRight: "5px" }} />
                  メールアドレスをコピーする
                </button>
              </CopyToClipboard>
            </div>
          </Row>
        </Col>
        <Col md={{ span: 20, offset: 2 }}>
          <div className="mail-copy">
            <span>
              2.
              ぐるなび管理画面にて、1でコピーした取込専用メールアドレスを登録してください。
            </span>
          </div>
          <Row justify="center">
            <div className="link-to-web">
              <Tooltip
                title={secretTootlTipTitle}
                style={{
                  transform: "translate(-16px, 0px)",
                  color: "red",
                }}
                arrowPointAtCenter
              >
                <span>
                  <QuestionMarkIcon
                    inputProps={{
                      style: {
                        transform: "translate(0px, 10.5px)",
                        cursor: "pointer",
                      },
                    }}
                  />
                </span>
              </Tooltip>
              <div className="copy-clipboard">
                <a
                  href="https://pro.gnavi.co.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-to-gnavi"
                >
                  <button className="copy-button">
                    <ExternalLinkIcon
                      width="16"
                      height="16"
                      stroke="white"
                      inputProps={{
                        style: {
                          transform: "translate(0px, 2px)",
                          color: "white",
                          fontSize: "16px",
                          marginRight: "5px",
                        },
                      }}
                    />
                    ぐるなび管理画面を開く
                  </button>
                </a>
              </div>
            </div>
          </Row>
          <Row justify="center" style={{ marginTop: "1rem" }}>
            <span className="footer-title">※既定のブラウザが開きます</span>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
