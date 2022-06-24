import React from "react";
import PropTypes from "prop-types";
import { getDayOfWeek } from "utils/common";

import { Modal, Row, Col, Button, Typography } from "antd";

export default function NetReservationConfirmModal({
  isModalVisible,
  handleCancel,
  handleOk,
  data,
}) {
  const { Text } = Typography;

  const footer = [
    <Button key="cancel" onClick={handleCancel} style={{ color: "#000" }}>
      戻る
    </Button>,
    <Button key="link" onClick={handleOk} type="primary">
      確定
    </Button>,
  ];

  return (
    <Modal
      visible={isModalVisible}
      onCancel={handleCancel}
      afterClose={handleCancel}
      footer={footer}
      destroyOnClose={true}
      title={"ご予約内容確認"}
      className="reservation-modal"
    >
      <Row>
        <Col span={24} style={{ paddingBottom: 25 }}>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            以下の内容で予約を申し込みます。
          </Text>
        </Col>
        <Col span={5}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>ご来店日：</Text>
        </Col>
        <Col span={19}>
          <Text style={{ fontSize: 16 }}>
            {data.date?.format("YYYY-MM-DD")} {getDayOfWeek(data.date?.day())}
          </Text>
        </Col>
        <Col span={5}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>ご来店人数：</Text>
        </Col>
        <Col span={19}>
          <Text style={{ fontSize: 16 }}>
            {" "}
            大人 {data.adultNumber}人 子ども {data.childNumber}人
          </Text>
        </Col>
        <Col span={5}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>お名前：</Text>
        </Col>
        <Col span={19}>
          <Text style={{ fontSize: 16 }}>
            {data.lastName + " " + data.firstName}様
          </Text>
        </Col>{" "}
        <Col span={5}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>携帯番号：</Text>
        </Col>
        <Col span={19}>
          <Text style={{ fontSize: 16 }}>{data.phoneNumber}</Text>
        </Col>
        <Col span={5}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>メール：</Text>
        </Col>
        <Col span={19}>
          <Text style={{ fontSize: 16 }}>{data.email}</Text>
        </Col>
        <Col span={5}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>メニュー：</Text>
        </Col>
        <Col span={19}>
          <Text style={{ fontSize: 16 }}>
            {" "}
            {data.menus?.map((m, i) =>
              i + 1 !== data.menus.length ? m.name + "," : m.name
            )}
          </Text>
        </Col>{" "}
        <Col span={5}>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>ご要望等：</Text>
        </Col>
        <Col span={19}>
          <Text style={{ fontSize: 16 }}>{data.note}</Text>
        </Col>
        <Col span={24} style={{ marginTop: 20 }}>
          <p style={{ fontWeight: 600 }}>
            ※インターネットからのご予約は{" "}
            <span style={{ color: "red", fontSize: 17 }}>仮予約</span>{" "}
            となります。
          </p>
          <p style={{ fontWeight: 600 }}>
            ※ご予約内容を確認後、店舗よりご連絡いたします。
          </p>
        </Col>
      </Row>
    </Modal>
  );
}

NetReservationConfirmModal.propTypes = {
  isModalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  data: PropTypes.any,
};
