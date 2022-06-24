import React, { useEffect, useState } from "react";
import { Col, Row, Steps, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import Layout from "containers/Layout";
import FormHeader from "components/FormHeader";
import LineLogo from "components/Icons/LineLogo";
import "./style/index.less";
import LineCreation from "components/LineControllers/LineCreation";
import LineAPISettings from "components/LineControllers/LineAPISettings";
import LineChannelRegistration from "components/LineControllers/LineChannelRegistration";
import LineConfigurationList from "components/LineControllers/LineConfigurationList";
import CommonSteps from "components/LineControllers/atoms/CommonSteps.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setLoading,
  setSuccessMessage,
  toggleBackdrop,
} from "actions/common";
import {
  createLineConfig,
  deleteLineConfig,
  fetchLineBotInfo,
  fetchLineConfigByStoreId,
  fetchWebhookInfo,
  setIsCreatedLineConfig,
  setLineBotInfo,
  setWebhookInfo,
} from "actions/lineConfig";
import { API_URL } from "settings/config";

const { Step } = Steps;
const { confirm } = Modal;

export default function LineConfiguration() {
  const dispatch = useDispatch();
  // useSelector
  const backdrop = useSelector((state) => state.layoutReducer.backdrop);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const lineConfigData = useSelector(
    (state) => state.lineConfigReducer.lineConfigData
  );
  const lineBotInfo = useSelector(
    (state) => state.lineConfigReducer.lineBotInfo
  );
  const webhookInfo = useSelector(
    (state) => state.lineConfigReducer.webhookInfo
  );
  const created = useSelector(
    (state) => state.lineConfigReducer.isCreatedLineConfig
  );
  const isIphone = useSelector((state) => state.layoutReducer.isIphone);
  // useState
  const [current, setCurrent] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [channelSecret, setChannelSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [showLineConfList, setShowLineConfigList] = useState(false);

  const resetState = () => {
    setCurrent(0);
    setSubStep(0);
    setChannelSecret("");
    setAccessToken("");
    setShowLineConfigList(false);
    dispatch(setLineBotInfo(null));
    dispatch(setWebhookInfo(null));
  };
  // useEffect
  useEffect(() => {
    resetState();
  }, []);
  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(fetchLineConfigByStoreId(selectedStore.id));
    resetState();
  }, [selectedStore]);
  useEffect(() => {
    if (lineConfigData.length > 0) {
      setShowLineConfigList(true);
    } else {
      setShowLineConfigList(false);
    }
  }, [lineConfigData, selectedStore]);

  useEffect(() => {
    if (lineBotInfo?.chatMode === "bot") {
      setSubStep(subStep + 1);
    } else if (lineBotInfo && lineBotInfo?.chatMode === "chat") {
      dispatch(setError("応答モードをBotにしてください"));
    }
  }, [lineBotInfo]);

  useEffect(() => {
    if (
      webhookInfo?.endpoint === `${API_URL}line/webhook/callback` &&
      webhookInfo?.active
    ) {
      const data = {
        botBasicId: lineBotInfo.basicId,
        botUserId: lineBotInfo.userId,
        channelAccessToken: accessToken,
        channelName: lineBotInfo.displayName,
        channelSecret: channelSecret,
        storeId: selectedStore.id,
      };
      dispatch(createLineConfig(data));
    } else if (webhookInfo) {
      dispatch(setLoading(false));
      dispatch(toggleBackdrop(true));
      setSubStep(3);
    }
  }, [webhookInfo]);
  useEffect(() => {
    if (created) {
      setCurrent(current + 1);
      setSubStep(0);
      dispatch(setIsCreatedLineConfig(false));
    }
  }, [created]);
  // methods
  const next = () => {
    setCurrent(current + 1);
  };

  const nextSubStep = () => {
    setSubStep(subStep + 1);
  };

  const getLineBotInfo = () => {
    dispatch(setLoading(true));
    dispatch(fetchLineBotInfo(accessToken));
  };

  const checkWebhookValidity = () => {
    dispatch(setLoading(true));
    dispatch(fetchWebhookInfo(accessToken));
    dispatch(toggleBackdrop(false));
  };

  const prev = () => {
    setCurrent(current - 1);
    setSubStep(0);
  };
  const cancel = () => {
    setCurrent(0);
    setSubStep(0);
  };

  const handleChannelSecret = (val) => {
    setChannelSecret(val);
  };

  const handleAccessToken = (val) => {
    setAccessToken(val);
  };

  const onCopyText = () => {
    dispatch(setSuccessMessage("クリップボードへコピーしました。"));
  };

  const completeHandler = () => {
    resetState();
    dispatch(setLoading(true));
    dispatch(fetchLineConfigByStoreId(selectedStore.id));
  };
  const deleteConfigHandler = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したデータはもとに戻せません。LINE連携設定を削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(deleteLineConfig(record.id, selectedStore.id));
        dispatch(setLoading(true));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // constant data
  const steps = [
    {
      title: "LINE作成",
      content: <LineCreation current={current} />,
    },
    {
      title: "API設定",
      content: <LineAPISettings isIphone={isIphone} />,
    },
    {
      title: "チャネル登録",
      content: (
        <LineChannelRegistration
          handleAccessToken={handleAccessToken}
          handleChannelSecret={handleChannelSecret}
          isIphone={isIphone}
        />
      ),
    },
    {
      title: "連携完了",
      content: (
        <LineCreation current={current} completeHandler={completeHandler} />
      ),
    },
  ];
  const tootlTipTitle =
    "LINE Developersにて該当するチャネルを選択し、「Messaging API設定」メニューを選択。「Webhookの利用」をONにすることで有効にできます。";
  const headings = [
    "Webhook受信テストを実行します。",
    !webhookInfo?.active
      ? "Webhookが有効になっていません。"
      : "URLが違うようです。 正確なURLを入力ください",
  ];
  const subHeadings = [
    "「Webhookの利用」が有効かどうかご確認いただき、受信テストを実行してください。",
    !webhookInfo?.active
      ? "LINE Developers内の「Webhookの利用」を有効にして、実行ボタンを押してください"
      : "",
  ];
  const buttonTitle = "Webhookを有効にする";
  const buttonLink = "https://developers.line.biz/console/";
  const subSteps = [
    {
      content: (
        <LineChannelRegistration subStep={subStep} lineBotInfo={lineBotInfo} />
      ),
    },
    {
      content: (
        <CommonSteps
          headings={headings[0]}
          subHeadings={subHeadings[0]}
          tootlTipTitle={tootlTipTitle}
          buttonTitle={buttonTitle}
          buttonLink={buttonLink}
          backdrop={backdrop}
          onCopyText={onCopyText}
          isIphone={isIphone}
        />
      ),
    },
    {
      content: (
        <CommonSteps
          headings={headings[1]}
          subHeadings={subHeadings[1]}
          tootlTipTitle={tootlTipTitle}
          buttonTitle={buttonTitle}
          buttonLink={buttonLink}
          backdrop={backdrop}
          onCopyText={onCopyText}
          isIphone={isIphone}
        />
      ),
    },
  ];
  return (
    <Layout>
      {showLineConfList ? (
        <LineConfigurationList
          data={lineConfigData}
          deleteConfigHandler={deleteConfigHandler}
        />
      ) : (
        <div className="line-container">
          <Row style={{ marginBottom: "6.17px" }}>
            <FormHeader
              title={"LINE連携"}
              icon={<LineLogo width="28" height="28" />}
            />
          </Row>
          <Row
            align="middle"
            style={{ marginBottom: "48px", justifyContent: "center" }}
          >
            <Col span={isIphone ? 20 : 12}>
              <Steps current={current}>
                {steps.map((item, index) => (
                  <Step
                    key={item.title}
                    description={item.title}
                    icon={index + 1}
                  />
                ))}
              </Steps>
            </Col>
          </Row>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: "20px" }}
          >
            <Col span={24}>
              {subStep !== 0 && current === 2 ? (
                <div className="steps-content">
                  {subSteps[subStep - 1].content}
                </div>
              ) : (
                <div className="steps-content">{steps[current].content}</div>
              )}
            </Col>
          </Row>
          <Row
            justify="space-between"
            align="bottom"
            style={{ marginBottom: "20px" }}
          >
            <div
              className="steps-action"
              style={{
                display: "flex",
                justifyContent:
                  current === 0 || subStep > 1 ? "flex-end" : "space-between",
                width: "100%",
              }}
            >
              {current > 0 && current !== 3 && subStep === 0 && (
                <button
                  className="button button-white button-primary-2"
                  onClick={() => prev()}
                >
                  戻る
                </button>
              )}
              {subStep === 1 && current === 2 && (
                <button
                  className="button button-white button-primary-2"
                  onClick={() => cancel()}
                >
                  キャンセル
                </button>
              )}
              {current === 2 && (
                <button
                  type="primary"
                  className={
                    accessToken === "" || channelSecret === ""
                      ? "button button-disabled button-primary-2"
                      : "button button-dark-blue button-primary-2"
                  }
                  disabled={accessToken === "" || channelSecret === "" || false}
                  onClick={() =>
                    subStep === 2 || subStep === 3
                      ? checkWebhookValidity()
                      : subStep > 0
                      ? nextSubStep()
                      : getLineBotInfo()
                  }
                  style={{
                    zIndex: backdrop ? "999" : "0",
                    position: "relative",
                  }}
                >
                  {subStep > 0 ? "セットアップを実行する" : "送信する"}
                </button>
              )}
              {current < steps.length - 1 && current !== 2 && (
                <button
                  type="primary"
                  className="button button-dark-blue button-primary-2"
                  onClick={() => next()}
                >
                  次のステップへ
                </button>
              )}
            </div>
          </Row>
        </div>
      )}
    </Layout>
  );
}
