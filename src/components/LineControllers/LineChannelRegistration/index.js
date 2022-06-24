import React from "react";
import { Row, Col, Tooltip, Input } from "antd";
import PropTypes from "prop-types";
import QuestionMarkIcon from "components/Icons/QuestionMarkIcon";
import Label from "components/Form/atoms/Label";
import LineButton from "../atoms/LineButton";

const secretTootlTipTitle =
  "LINE Official Account Managerにログインしたら、画面右上の「設定」を選択。左メニューから、「Messaging API」を選択し、「Channel secret」を確認できます。";
const accessTokenTootlTipTitle =
  "LINE Developersにて該当するチャネルを選択し、「Messaging API設定」メニューを選択。「チャネルアクセストークン」項目の右手にある「発行」ボタンで確認できます。";

export default function LineChannelRegistration({
  handleAccessToken,
  handleChannelSecret,
  subStep = null,
  lineBotInfo = null,
  isIphone,
}) {
  return (
    <div className="form-wrapper" style={{ paddingRight: "0px" }}>
      <Row className="form-section">
        <Col md={{ span: 20, offset: 2 }}>
          <div className="input-element" style={{ textAlign: "center" }}>
            {subStep && subStep === 1 ? (
              <>
                <span className="line-configuration-span">
                  以下のLINE公式アカウントのセットアップをします。
                </span>
                <br />
                <Row span={24} style={{ marginTop: "32px" }}>
                  <Col span={12} className="channel-reg-col channel-reg-col-1">
                    ベーシックID
                  </Col>
                  <Col span={12} className="channel-reg-col channel-reg-col-2">
                    {lineBotInfo?.basicId}
                  </Col>
                </Row>
                <Row span={24}>
                  <Col span={12} className="channel-reg-col channel-reg-col-1">
                    アカウント名
                  </Col>
                  <Col span={12} className="channel-reg-col channel-reg-col-2">
                    {lineBotInfo?.displayName}
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <span className="line-configuration-span">
                  LINE公式アカウントのチャネルシークレットと、チャネルアクセストークン（長期）を入力して送信してください。
                </span>
                <br />
                <Col md={{ span: 20, offset: 2 }} style={{ marginTop: "38px" }}>
                  <div
                    className="input-group"
                    style={{
                      borderBottom: "1px solid #dbdbdb",
                      marginBottom: "40px",
                    }}
                  >
                    <Label label={"チャネルシークレット "} required={false} />
                    <div className="input-element">
                      <Input
                        placeholder="チャネルシークレットを入力してください"
                        className={"ant-input-custom"}
                        style={{ maxWidth: "100%" }}
                        onChange={(val) =>
                          handleChannelSecret(val.target.value)
                        }
                      />
                    </div>
                    <div className="channel-reg-flex-button">
                      <Tooltip
                        placement={isIphone ? "topLeft" : "top"}
                        title={secretTootlTipTitle}
                        style={{ transform: "translate(-16px, 0px)" }}
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
                      <LineButton
                        title="チャネルシークレットを確認する"
                        link="https://manager.line.biz/"
                        inputProps={{
                          style: { marginLeft: "16px", marginBottom: "40px" },
                        }}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <Label
                      label={"チャネルアクセストークン"}
                      required={false}
                    />
                    <div className="input-element">
                      <Input
                        placeholder="チャネルアクセストークンを入力してください"
                        className={"ant-input-custom"}
                        style={{ maxWidth: "100%" }}
                        onChange={(val) => handleAccessToken(val.target.value)}
                      />
                    </div>
                    <div className="channel-reg-flex-button">
                      <Tooltip
                        placement={isIphone ? "topLeft" : "top"}
                        title={accessTokenTootlTipTitle}
                        style={{ transform: "translate(-16px, 0px)" }}
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
                      <LineButton
                        title="アクセストークンを確認する"
                        link="https://developers.line.biz/console/"
                        inputProps={{
                          style: { marginLeft: "16px" },
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

LineChannelRegistration.propTypes = {
  handleAccessToken: PropTypes.func,
  handleChannelSecret: PropTypes.func,
  subStep: PropTypes.any,
  lineBotInfo: PropTypes.any,
  isIphone: PropTypes.bool,
};
