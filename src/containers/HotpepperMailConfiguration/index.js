import { setError } from "actions/common";
import { setHotpepperMailConfig } from "actions/hotpepperMailConfig";
import { Col, Row, Steps } from "antd";
import HotpepperConfirmMail from "components/EmailControllers/Hotpepper/HotpepperConfirmMail";
import HotpepperConFirmMailEnd from "components/EmailControllers/Hotpepper/HotpepperConfirmMailEnd";
import HotpepperRegistration from "components/EmailControllers/Hotpepper/HotpepperRegistration";
import Layout from "containers/Layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import auth from "utils/auth";
import "./style/index.less";
const { Step } = Steps;

export default function HotpepperMailConfiguration() {
  const [checkEnd1, setCheckEnd1] = useState(false);
  const [checkEnd2, setCheckEnd2] = useState(false);
  const [checkEnd3, setCheckEnd3] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const isIphone = useSelector((state) => state.layoutReducer.isIphone);
  const callAPICreateSuccess = useSelector(
    (state) => state.hotpepperConfirmMailReducer.flagCreateSuccess
  );
  const [current, setCurrent] = useState(0);
  const handleClick = async () => {
    if (checkEnd1 && checkEnd2 && checkEnd3) {
      await dispatch(
        setHotpepperMailConfig({
          companyCode: `${auth.getKey("loginUser.companyCode")}`,
          storeId: `${auth.getKey("loginUser.storeId")}`,
          type: "hotpepper",
        })
      );
    } else {
      dispatch(setError("設定の確認をチェックしてください。"));
    }
  };
  useEffect(() => {
    if (callAPICreateSuccess) {
      history.push("/email-configuration");
    }
  }, [callAPICreateSuccess]);

  const resetState = () => {
    setCurrent(0);
  };

  const oncheckEnd1 = (value) => {
    setCheckEnd1(!value);
  };

  const oncheckEnd2 = (value) => {
    setCheckEnd2(!value);
  };

  const oncheckEnd3 = (value) => {
    setCheckEnd3(!value);
  };

  useEffect(() => {
    resetState();
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "メールアドレスの登録",
      content: <HotpepperRegistration />,
    },
    {
      title: "メールアドレスの認証",
      content: (
        <HotpepperConfirmMail
          companyCode={auth.getKey("loginUser.companyCode")}
        />
      ),
    },
    {
      title: "設定の確認",
      content: (
        <HotpepperConFirmMailEnd
          oncheckEnd1={oncheckEnd1}
          oncheckEnd2={oncheckEnd2}
          oncheckEnd3={oncheckEnd3}
        />
      ),
    },
  ];
  return (
    <Layout>
      <div className="mail-container">
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
            <div className="steps-content">{steps[current].content}</div>
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
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {current === 0 && (
              <button
                className="button button-white button-primary-2"
                onClick={() => history.push("/email-configuration")}
              >
                キャンセル
              </button>
            )}
            {current > 0 && current !== 3 && (
              <button
                className="button button-white button-primary-2"
                onClick={() => prev()}
              >
                戻る
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
            {current === 2 && (
              <button
                type="primary"
                className="button button-dark-blue button-primary-2"
                onClick={handleClick}
              >
                完了
              </button>
            )}
          </div>
        </Row>
      </div>
    </Layout>
  );
}
