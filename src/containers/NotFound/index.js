import React from "react";
import bg from "assets/bg.svg";
import { Typography, Divider } from "antd";

export default function NotFound() {
  const { Title, Text } = Typography;
  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
      }}
      className={"container"}
    >
      <div className="net-form">
        <Title>Page not found.</Title>
        <Divider />
        <Title level={4}>ページが見つかりません</Title>
        <Text>
          ご指定のページは削除されたか、アドレスが間違っている可能性があります。
        </Text>
      </div>
    </div>
  );
}
