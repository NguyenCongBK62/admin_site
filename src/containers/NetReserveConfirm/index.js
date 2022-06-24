import React, { useEffect } from "react";
import { useHistory } from "react-router";
import bg from "assets/bg.svg";

import "containers/NetReservation/style/index.less";
import { Typography, Divider } from "antd";

export default function NetReservationConfirm(props) {
  const history = useHistory();

  useEffect(() => {
    const state = history.location.state;
    if (!state?.store) {
      history.goBack();
    }
  }, [history]);
  const { Title, Text } = Typography;
  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        padding: "0",
      }}
      className={"container"}
    >
      <div className="net-form">
        <Title style={{ padding: "0 25px" }}>
          {" "}
          {history.location.state?.store?.displayName} ネット予約フォーム
        </Title>
        <Divider />
        <Text
          style={{
            fontSize: 22,
            fontWeight: 600,
            display: "block",
            margin: "15px 0",
          }}
        >
          仮予約を承りました。
        </Text>
        <Text>ご予約内容を確認後、店舗よりご連絡いたします。</Text>

        <div style={{ margin: "15px 0" }}>
          <button
            type="button"
            className="button button-default button-default-2"
            style={{ marginRight: 15 }}
            onClick={() => window.close()}
          >
            画面を閉じる
          </button>

          <button
            type="button"
            className="button button-primary button-primary-2"
            onClick={() => history.goBack()}
          >
            続けて予約をとる
          </button>
        </div>
      </div>
    </div>
  );
}
